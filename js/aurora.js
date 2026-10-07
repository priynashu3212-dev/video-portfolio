/* ==========================================================================
   AURORA — the live fallback for the hero background.

   The hero's primary backdrop is assets/hero-loop.{webm,mp4}: a real looping
   video, rendered offline from this exact flow-field shader. This file paints
   the same field live, so there is motion on screen from the first frame
   without waiting for the video to download, and it is what you are left
   looking at if the video cannot play.

   It stands down automatically once the video reports it is ready (see
   window.Aurora.stop, called from js/main.js), so the two never animate at
   the same time and burn two GPUs' worth of fill rate.

   Colours are read from the CSS custom properties in css/style.css, so
   changing --accent-2 there retints the whole animation.

   Degrades safely, in order:
     1. WebGL shader (normal)
     2. 2D canvas, two drifting radial gradients
     3. The static poster image on .hero-media

   Also respects prefers-reduced-motion by rendering a single still frame.
   ========================================================================== */

(() => {
  const canvas = document.getElementById("aurora");
  if (!canvas) return;

  const root = document.documentElement;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");

  /* Set by whichever path ends up running, so window.Aurora.stop() below can
     halt it once the encoded hero video has taken over. */
  let stopLive = () => {};

  /* Public handle for js/main.js. The hero video is the primary backdrop and
     this canvas is its fallback, so the moment the video is genuinely playing
     we shut the shader down rather than run both at once. */
  window.Aurora = {
    stop() {
      stopLive();
      canvas.hidden = true;
    },
  };

  /* Render below native resolution. The field is soft and heavily blurred by
     its own math, so upscaling costs nothing visually and saves a lot of
     fill rate on a full-viewport canvas. */
  const SCALE = 0.55;
  const MAX_DPR = 1.75;

  const readColor = (name, fallback) => {
    const v = getComputedStyle(root).getPropertyValue(name).trim();
    if (!v) return fallback;
    const n = parseInt(v.replace("#", ""), 16);
    if (Number.isNaN(n)) return fallback;
    return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
  };

  const VERT = `
    attribute vec2 aPos;
    void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
  `;

  const FRAG = `
    precision highp float;

    uniform vec2  uRes;
    uniform float uTime;
    uniform vec3  uBase;
    uniform vec3  uMid;
    uniform vec3  uDeep;
    uniform vec3  uWarm;
    uniform vec3  uHot;
    uniform vec3  uDark;

    float hash(vec2 p) {
      p = fract(p * vec2(123.34, 456.21));
      p += dot(p, p + 45.32);
      return fract(p.x * p.y);
    }

    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      vec2 u = f * f * (3.0 - 2.0 * f);
      float a = hash(i);
      float b = hash(i + vec2(1.0, 0.0));
      float c = hash(i + vec2(0.0, 1.0));
      float d = hash(i + vec2(1.0, 1.0));
      return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
    }

    float fbm(vec2 p) {
      float v = 0.0;
      float a = 0.5;
      mat2 rot = mat2(1.6, 1.2, -1.2, 1.6);
      for (int i = 0; i < 5; i++) {
        v += a * noise(p);
        p = rot * p;
        a *= 0.5;
      }
      return v;
    }

    void main() {
      vec2 uv = gl_FragCoord.xy / uRes.xy;
      vec2 p  = (gl_FragCoord.xy - 0.5 * uRes.xy) / uRes.y;

      // Circular rather than linear drift. Same field as the encoded video,
      // and it means the loop has a natural period.
      float ph = uTime * 0.42;
      vec2 q = p + vec2(cos(ph), sin(ph)) * 0.30;

      // Domain warping: the noise field is displaced by more noise, which is
      // what turns a plain cloud into something that reads as flowing light.
      vec2 w = vec2(fbm(q), fbm(q + vec2(3.7, 1.2)));
      vec2 r = vec2(fbm(q + 2.6 * w + vec2(1.3, 7.1)), fbm(q + 2.2 * w + vec2(6.4, 2.2)));
      float f = fbm(q + 2.0 * r);

      vec3 col = uBase;
      col = mix(col, uMid,  smoothstep(0.18, 0.62, f) * 0.95);
      col = mix(col, uDeep, smoothstep(0.48, 0.88, f) * 0.80);
      col = mix(col, uHot,  clamp((length(r) - 0.42) * 2.2, 0.0, 1.0) * 0.40);
      col = mix(col, uDark, smoothstep(0.70, 0.96, f) * 0.50);

      // Thin ridged filaments give the flow visible definition, like silk.
      float ridge = 1.0 - abs(2.0 * f - 1.0);
      col += uWarm * pow(ridge, 7.0) * 0.09;

      // Warm light pooling in from the top right, like a window off-frame. Kept
      // restrained: too much sheen here lifts the mean and flattens the field.
      float d = length(uv - vec2(0.82, 0.86));
      col += uHot * 0.06 * exp(-d * 2.6);
      col += vec3(1.0, 0.98, 0.95) * 0.06 * exp(-length(uv - vec2(0.86, 0.90)) * 3.4);

      // Vignette keeps the headline area calm without bleaching the frame.
      col *= 1.0 - 0.20 * smoothstep(0.40, 1.30, length(p * vec2(1.0, 1.2)));

      // Fine grain stops gradient banding across the wide, flat areas.
      float g = hash(gl_FragCoord.xy + fract(uTime) * 97.0);
      col += (g - 0.5) * 0.016;

      gl_FragColor = vec4(col, 1.0);
    }
  `;

  const compile = (gl, type, src) => {
    const sh = gl.createShader(type);
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
      gl.deleteShader(sh);
      return null;
    }
    return sh;
  };

  /* ---------- attempt WebGL ---------- */
  const gl =
    canvas.getContext("webgl", { antialias: false, alpha: false, powerPreference: "low-power" }) ||
    canvas.getContext("experimental-webgl", { antialias: false, alpha: false });

  if (gl) {
    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    const program = vs && fs ? gl.createProgram() : null;

    if (program) {
      gl.attachShader(program, vs);
      gl.attachShader(program, fs);
      gl.linkProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    }

    if (!program || !gl.getProgramParameter(program, gl.LINK_STATUS)) {
      fallback2D();
    } else {
      startWebGL(program);
    }
  } else {
    fallback2D();
  }

  /* ---------- WebGL path ---------- */
  function startWebGL(program) {
    gl.useProgram(program);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW
    );

    const aPos = gl.getAttribLocation(program, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(program, "uRes");
    const uTime = gl.getUniformLocation(program, "uTime");
    const uBase = gl.getUniformLocation(program, "uBase");
    const uMid = gl.getUniformLocation(program, "uMid");
    const uDeep = gl.getUniformLocation(program, "uDeep");
    const uWarm = gl.getUniformLocation(program, "uWarm");
    const uHot = gl.getUniformLocation(program, "uHot");
    const uDark = gl.getUniformLocation(program, "uDark");

    const paint = () => {
      gl.uniform3fv(uBase, readColor("--bg", [0.98, 0.96, 0.93]));
      gl.uniform3fv(uMid, readColor("--mid", [0.93, 0.88, 0.80]));
      gl.uniform3fv(uDeep, readColor("--deep", [0.70, 0.58, 0.44]));
      gl.uniform3fv(uWarm, readColor("--warm", [0.91, 0.77, 0.54]));
      gl.uniform3fv(uHot, readColor("--accent-2", [0.64, 0.34, 0.18]));
      gl.uniform3fv(uDark, readColor("--dark", [0.49, 0.34, 0.21]));
    };
    paint();

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      const w = Math.max(1, Math.round(innerWidth * dpr * SCALE));
      const h = Math.max(1, Math.round(innerHeight * dpr * SCALE));
      if (canvas.width === w && canvas.height === h) return;
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
      gl.uniform2f(uRes, w, h);
      if (reduced.matches) draw(0);
    };

    let raf = 0;
    let last = 0;
    const t0 = performance.now();
    const MIN_FRAME_MS = 1000 / 30; // cap at 30fps; the field is slow, so it reads the same

    function draw(t) {
      gl.uniform1f(uTime, t);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }

    function loop(now) {
      raf = requestAnimationFrame(loop);
      if (now - last < MIN_FRAME_MS) return;
      last = now;
      draw((now - t0) / 1000);
    }

    const play = () => {
      if (raf || !onScreen()) return;
      last = 0;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      if (!raf) return;
      cancelAnimationFrame(raf);
      raf = 0;
    };

    /* The canvas is full-viewport, so leaving it running once the hero has
       scrolled away is pure wasted battery. This is the difference between
       a site that is pleasant to sit on and one that heats up a laptop. */
    function onScreen() {
      return canvas.getBoundingClientRect().bottom > 0;
    }
    const heroIO = new IntersectionObserver(
      (entries) => (entries[0].isIntersecting ? play() : stop()),
      { threshold: 0 }
    );
    heroIO.observe(canvas);

    addEventListener("resize", resize);
    addEventListener("orientationchange", resize);
    document.addEventListener("visibilitychange", () => (document.hidden ? stop() : play()));
    reduced.addEventListener("change", (e) => (e.matches ? (stop(), draw((performance.now() - t0) / 1000)) : play()));

    resize();
    if (reduced.matches) {
      draw((performance.now() - t0) / 1000);
    } else {
      play();
    }

    stopLive = stop;

    // Read by the automated render check to confirm the shader linked.
    canvas.dataset.gl = "ok";
  }

  /* ---------- 2D canvas fallback ---------- */
  function fallback2D() {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const blobs = [
      { c: readColor("--accent-2", [0.64, 0.34, 0.18]), r: 0.62, x: 0.72, y: 0.18, s: 0.00004 },
      { c: readColor("--deep", [0.78, 0.71, 0.61]), r: 0.5, x: 0.16, y: 0.84, s: -0.00003 },
    ];
    const base = readColor("--bg", [0.97, 0.96, 0.94]);
    const rgba = (c, a) => `rgba(${Math.round(c[0] * 255)},${Math.round(c[1] * 255)},${Math.round(c[2] * 255)},${a})`;
    const rgb = (c) => `rgb(${Math.round(c[0] * 255)},${Math.round(c[1] * 255)},${Math.round(c[2] * 255)})`;

    let w = 0;
    let h = 0;
    const resize = () => {
      w = canvas.width = Math.round(innerWidth * 0.5);
      h = canvas.height = Math.round(innerHeight * 0.5);
      if (reduced.matches) paint(0);
    };

    function paint(t) {
      ctx.fillStyle = rgb(base);
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      for (const b of blobs) {
        const x = (b.x + Math.cos(t * b.s) * 0.1) * w;
        const y = (b.y + Math.sin(t * b.s * 1.3) * 0.1) * h;
        const r = b.r * Math.max(w, h);
        const g = ctx.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, rgba(b.c, 0.32));
        g.addColorStop(1, rgba(b.c, 0));
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
      }
      ctx.globalCompositeOperation = "source-over";
    }

    addEventListener("resize", resize);
    resize();

    let raf2d = 0;
    if (reduced.matches) {
      paint(0);
    } else {
      const t0 = performance.now();
      const loop = (now) => {
        if (document.hidden) {
          raf2d = requestAnimationFrame(loop);
          return;
        }
        paint((now - t0) / 1000);
        raf2d = requestAnimationFrame(loop);
      };
      raf2d = requestAnimationFrame(loop);
    }

    stopLive = () => {
      if (raf2d) cancelAnimationFrame(raf2d);
      raf2d = 0;
    };

    canvas.dataset.gl = "2d";
  }
})();
