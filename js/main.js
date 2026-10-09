/* CONFIG comes from js/config.js and PROJECTS from data/projects.js.
   Edit those two files — not this one. */

const pad = (n) => String(n).padStart(2, "0");

/* ---------- hero backdrop hand-off ---------- */
/* The encoded hero-loop video is the primary backdrop. The WebGL canvas
   painted behind it is the instant-start fallback, so there is motion on
   screen before the video finishes downloading. The video is only faded in
   once the browser confirms it can actually play it, and the shader is shut
   down at the same moment so the two never animate at once. */
const heroVideo = document.getElementById("heroVideo");

if (heroVideo) {
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");

  if (reduced.matches) {
    /* No autoplay for visitors who asked for less motion. The poster image
       on .hero-media is exactly the right still to show instead. */
    heroVideo.removeAttribute("autoplay");
    heroVideo.pause();
    window.Aurora?.stop();
  } else {
    const handOver = () => {
      heroVideo.classList.add("is-ready");
      window.Aurora?.stop();
    };

    if (heroVideo.readyState >= 3) {
      handOver();
    } else {
      heroVideo.addEventListener("canplay", handOver, { once: true });
      /* If the file is missing or undecodable, do nothing: the shader stays
         up and the hero still has movement and colour behind it. */
    }
  }
}

document.querySelectorAll('[data-cfg="name"]').forEach((el) => (el.textContent = CONFIG.name));
document.querySelectorAll('[data-cfg="role"]').forEach((el) => (el.textContent = CONFIG.role));
document.querySelectorAll('[data-cfg="city"]').forEach((el) => (el.textContent = CONFIG.city));
document.querySelectorAll("[data-cfg-mail]").forEach((el) => {
  el.textContent = CONFIG.email;
  el.href = `mailto:${CONFIG.email}`;
});
document.querySelectorAll("[data-cfg-phone]").forEach((el) => {
  el.textContent = CONFIG.phone;
  el.href = `tel:${String(CONFIG.phone).replace(/[^+\d]/g, "")}`;
});

/* Contact details block in the contact section — phone, email, WhatsApp,
   location, all read from CONFIG so there is one source of truth. */
const contactDetails = document.getElementById("contactDetails");
if (contactDetails) {
  const tel = String(CONFIG.phone || "").replace(/[^+\d]/g, "");
  const rows = [
    { label: "Phone", value: CONFIG.phone, href: tel ? `tel:${tel}` : "" },
    { label: "Email", value: CONFIG.email, href: CONFIG.email ? `mailto:${CONFIG.email}` : "" },
    {
      label: "WhatsApp",
      value: CONFIG.phone,
      href: CONFIG.whatsapp ? `https://wa.me/${CONFIG.whatsapp}` : "",
    },
    { label: "Based in", value: CONFIG.city, href: "" },
  ].filter((row) => row.value);

  contactDetails.innerHTML = rows
    .map(
      (row) => `<li class="contact-detail reveal">
        <span class="mono contact-detail-label">${row.label}</span>
        ${
          row.href
            ? `<a href="${row.href}"${row.href.startsWith("http") ? ' target="_blank" rel="noopener"' : ""}>${row.value}</a>`
            : `<span>${row.value}</span>`
        }
      </li>`
    )
    .join("");
}
/* The <head> values (title, meta description, og/twitter tags) are the single
   source of truth and live in index.html — search engines read the raw HTML,
   and rewriting them here at runtime meant crawlers that execute JS saw a
   different title than the one in the source. Do not set document.title or
   the meta tags from this file. */

/* ---------- render everything else from CONFIG ---------- */

const display = document.querySelector(".display");
if (display && CONFIG.heroLines) {
  display.innerHTML = CONFIG.heroLines
    .map((line, i) => `<span class="line reveal" data-delay="${i}">${line}</span>`)
    .join("");
}

const heroSub = document.querySelector(".hero-sub");
if (heroSub && CONFIG.heroSub) heroSub.textContent = CONFIG.heroSub;

const avail = document.querySelector(".hero-bar .avail");
if (avail && CONFIG.availability) {
  avail.innerHTML = `<span class="dot"></span> ${CONFIG.availability}`;
} else if (avail) {
  avail.remove();
}

const aboutLead = document.querySelector(".about .lead");
if (aboutLead && CONFIG.aboutLead) aboutLead.textContent = CONFIG.aboutLead;

const aboutBody = document.querySelectorAll(".about-text p:not(.mono):not(.lead)");
CONFIG.aboutBody.forEach((text, i) => {
  if (aboutBody[i]) aboutBody[i].textContent = text;
});

const skillsList = document.getElementById("skills");
if (skillsList && CONFIG.skills) {
  skillsList.innerHTML = CONFIG.skills
    .map((s, i) => `<li><span class="num">${pad(i + 1)}</span> ${s}</li>`)
    .join("");
}

const statRow = document.getElementById("statRow");
if (statRow && CONFIG.stats) {
  /* The static text is the final value, not 0: crawlers that render JS (and
   anyone who hasn't scrolled to the band yet) must see the real number.
   buildOdometer() clears it and animates from 0 when it scrolls in. */
statRow.innerHTML = CONFIG.stats
    .map(
      (s, i) => `
      <li class="stat reveal" data-delay="${i % 4}">
        <span class="stat-value"><span data-count="${s.value}">${s.value}</span>${
          s.suffix ? `<em>${s.suffix}</em>` : ""
        }</span>
        <span class="stat-label mono">${s.label}</span>
      </li>`
    )
    .join("");
}

const serviceGrid = document.getElementById("serviceGrid");
if (serviceGrid && CONFIG.services) {
  serviceGrid.innerHTML = CONFIG.services
    .map(
      (s, i) => `
      <article class="service reveal" data-delay="${i % 3}">
        <span class="service-n mono">${pad(i + 1)}</span>
        <h3 class="service-title">${s.title}</h3>
        <p class="service-body">${s.body}</p>
      </article>`
    )
    .join("");
}

const stepsList = document.getElementById("steps");
if (stepsList && CONFIG.process) {
  stepsList.innerHTML = CONFIG.process
    .map(
      (p, i) => `
      <li class="step reveal" data-delay="${i}">
        <span class="step-n mono">${pad(i + 1)}</span>
        <h3 class="step-title">${p.title}</h3>
        <p class="step-body">${p.body}</p>
      </li>`
    )
    .join("");
}

/* Pointer-tracked highlight. Writes --mx/--my on the card, and the gradient
   that reads them lives in style.css. Skipped on touch and for visitors who
   have asked for less motion. */
if (!matchMedia("(prefers-reduced-motion: reduce)").matches && matchMedia("(hover: hover)").matches) {
  document.addEventListener("pointermove", (e) => {
    const card = e.target.closest?.(".service, .quote, .card");
    if (!card) return;
    const r = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${e.clientX - r.left}px`);
    card.style.setProperty("--my", `${e.clientY - r.top}px`);
  });
}

/* Testimonials only exist if there are real ones. An empty "What clients
   say" heading above nothing looks broken, and invented quotes look worse,
   so the whole section is removed when CONFIG.testimonials is empty. */
const quotes = document.getElementById("quotes");
const testimonialSection = document.querySelector(".testimonials");
if (quotes && CONFIG.testimonials?.length) {
  quotes.innerHTML = CONFIG.testimonials
    .map(
      (t, i) => `
      <figure class="quote reveal" data-delay="${i % 3}">
        <span class="quote-mark serif" aria-hidden="true">&ldquo;</span>
        <blockquote>${t.quote}</blockquote>
        <figcaption><strong>${t.name}</strong><span>${t.role}</span></figcaption>
      </figure>`
    )
    .join("");
} else {
  testimonialSection?.remove();
}

const nowGrid = document.getElementById("nowGrid");
if (nowGrid && CONFIG.now?.length) {
  nowGrid.innerHTML = CONFIG.now
    .map(
      (n, i) => `
      <article class="now-card reveal" data-delay="${i % 4}">
        <span class="now-n mono">${pad(i + 1)}</span>
        <h3 class="now-title">${n.title}</h3>
        <p class="now-body">${n.body}</p>
      </article>`
    )
    .join("");
} else {
  nowGrid?.closest("section")?.remove();
}

const journeyList = document.getElementById("journeyList");
if (journeyList && CONFIG.journey?.length) {
  journeyList.innerHTML = CONFIG.journey
    .map(
      (j, i) => `
      <li class="journey-item reveal" data-delay="${i % 4}">
        <span class="journey-when mono">${j.when}</span>
        <div class="journey-copy">
          <h3 class="journey-title">${j.title}</h3>
          <p class="journey-text">${j.body}</p>
        </div>
      </li>`
    )
    .join("");
} else {
  journeyList?.closest("section")?.remove();
}

const faqList = document.getElementById("faqList");
if (faqList && CONFIG.faq?.length) {
  faqList.innerHTML = CONFIG.faq
    .map(
      (f, i) => `
      <details class="faq-item reveal" data-delay="${i % 4}"${
        i === 0 ? " open" : ""
      }>
        <summary class="faq-q">
          <span class="num">${pad(i + 1)}</span>
          <span>${f.q}</span>
          <span class="faq-icon" aria-hidden="true">+</span>
        </summary>
        <p class="faq-a">${f.a}</p>
      </details>`
    )
    .join("");
} else {
  faqList?.closest("section")?.remove();
}

/* Renumber the section labels last, after optional sections have been
   removed, so the 01/02/03 sequence never shows a gap. */
let labelNo = 0;
document.querySelectorAll("main .label .num").forEach((el) => {
  labelNo += 1;
  el.textContent = pad(labelNo);
});

/* Empty photo slots fall back to the placeholder instead of a broken icon.
   Drop real files into assets/photos/ named portrait.jpg, photo-2.jpg, photo-3.jpg
   and they replace the placeholders automatically. */
const PHOTO_PLACEHOLDER = "assets/posters/photo-placeholder.svg";
document.querySelectorAll(".about-photo img").forEach((img) => {
  img.addEventListener("error", () => {
    if (img.src.endsWith(PHOTO_PLACEHOLDER)) return;
    img.src = PHOTO_PLACEHOLDER;
  }, { once: true });
});

const footerLinks = document.getElementById("footerLinks");if (footerLinks && CONFIG.socials) {
  footerLinks.innerHTML = CONFIG.socials
    .map(
      (s, i) =>
        `<li><span class="num">${pad(i + 1)}</span> <a href="${s.href}"${
          s.href && s.href !== "#" ? ' target="_blank" rel="noopener"' : ""
        }>${s.label} ${s.href && s.href !== "#" ? "↗" : ""}</a></li>`
    )
    .join("");
}

const workList = document.getElementById("workList");
const workSection = document.querySelector(".work");
const workWrap = document.getElementById("workWrap");

function buildCard(p, i) {
  /* Rebuilds the exact baked markup from index.html. replaceChildren below
     clears the baked list first, so crawlers and JS-rendered visitors read
     the same textContent (parity is asserted by seo-verify.mjs). */
  const card = document.createElement("li");
  card.className = "card";
  card.dataset.category = p.category;
  card.dataset.index = i;

  const meta = [p.client, p.year].filter(Boolean).join(" · ");

  card.innerHTML = `
    <span class="card-media">
      <img src="${p.poster}" alt="" loading="lazy" width="640" height="480" />
      <span class="card-no mono">${pad(i + 1)}</span>
      <span class="card-cat mono">${p.category}</span>
    </span>
    <span class="card-body">
      <span class="card-title">${p.title}</span>
      ${p.summary ? `<span class="card-summary">${p.summary}</span>` : ""}
      ${p.stack ? `<span class="card-stack mono">${p.stack}</span>` : ""}
      <span class="card-meta mono">${meta}</span>
    </span>
    <span class="card-cta" aria-hidden="true">View case study →</span>`;

  /* A real <button> rather than a div with role="button", so it is reachable
     by keyboard, announced correctly, and activates on Enter and Space
     without any hand-rolled key handling. It covers the whole card (.card-hit)
     and always opens the case study. */
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "card-hit";
  btn.setAttribute("aria-label", `${p.title} — view case study`);
  btn.addEventListener("click", () => openCaseStudy(p, i, btn));
  card.appendChild(btn);
  return card;
}

/* replaceChildren, not appendChild: index.html carries the same cards baked
   in for crawlers and no-JS visitors, so the list must be cleared first or
   every card would appear twice. Every project here has a case study, so the
   old filter chips are gone entirely. */
workList.replaceChildren(...PROJECTS.map((p, i) => buildCard(p, i)));

/* ---------- the 3D scroll deck ---------- */

/* Skipped entirely for visitors who asked for reduced motion, and when there
   is nothing to sequence — they get the plain staggered grid instead. */
const DECK_OK =
  !matchMedia("(prefers-reduced-motion: reduce)").matches && PROJECTS.length > 1;

if (DECK_OK && workSection && workWrap) {
  workSection.classList.add("is-deck");

  /* Scaffold the .stack > .stack-viewport > (.stack-bgs + .stack-stage)
     structure that style.css expects. The whole thing replaces the static
     card grid; only the section heading stays above it. */
  const stack = document.createElement("div");
  stack.className = "stack";
  stack.style.setProperty("--n", PROJECTS.length);

  const viewport = document.createElement("div");
  viewport.className = "stack-viewport";

  const bgs = document.createElement("div");
  bgs.className = "stack-bgs";
  bgs.setAttribute("aria-hidden", "true");
  for (let b = 1; b <= 3; b++) {
    const blob = document.createElement("span");
    blob.className = `stack-bg stack-bg--${b}`;
    bgs.appendChild(blob);
  }

  const stage = document.createElement("div");
  stage.className = "stack-stage";

  viewport.appendChild(bgs);
  viewport.appendChild(stage);
  stack.appendChild(viewport);
  workWrap.appendChild(stack);
  stage.appendChild(workList);

  /* Scroll physics. The sticky .stack-viewport pins the stage for the height
     of .stack (100vh × (n + 1.4)); as the page scrolls through it, one
     progress value p goes 0 -> 1 and drives every card. Only transform and
     opacity are written, throttled through one rAF per frame, so the deck
     stays at 60fps. */
  const cards = Array.from(workList.children);
  const blobs = Array.from(bgs.children);
  const n = cards.length;
  const amp = matchMedia("(max-width: 760px)").matches ? 0.45 : 1;
  const ROT = { x: 32 * amp, y: 15 * amp };     // degrees of tilt at the edges
  const RISE = 13 * amp;                        // % of viewport height dropped at the edges
  const ZOUT = 420 * amp;                       // px pulled back in z at the edges
  const SHRINK = 0.13 * amp;                    // scale loss at the edges
  let raf = 0;

  const update = () => {
    raf = 0;
    const s = stack.getBoundingClientRect();
    const vh = innerHeight;
    const travel = Math.max(1, stack.offsetHeight - vh);
    const p = Math.min(1, Math.max(0, -s.top / travel));
    const t = (p * (n + 0.4)) / n;

    /* Parallax blobs drift and swell opposite to the scroll direction. */
    blobs.forEach((el, i) => {
      const d = (0.5 - p) * (i + 1);
      el.style.transform = `translate3d(${(d * 40).toFixed(1)}px, ${(-d * 30).toFixed(1)}px, 0) scale(${(1 + Math.abs(d) * 0.05).toFixed(3)})`;
    });

    cards.forEach((card, i) => {
      /* d = 0 when the card is centred in the viewport; -1.3..1.3 spans the
         whole entrance-to-exit travel. */
      const d = Math.max(-1.3, Math.min(1.3, t - (i + 0.5) / n));
      const f = Math.tanh(d * 1.6);               // eased 0 at centre, ±1 at the edges
      const q = Math.min(1, Math.abs(d) / 0.95);  // 0 at centre -> 1 at edge
      /* Signed travel: a card rises into the centre line (-f) and falls away
         (+f) as it passes, so the deck reads as one belt of work. */
      const vert = (f * Math.abs(f) * RISE * vh * 0.01).toFixed(1);
      const rotX = (-f * ROT.x).toFixed(2);
      const rotY = (f * ROT.y).toFixed(2);
      const z = (-Math.abs(f) * ZOUT).toFixed(1);
      const scale = (1 - Math.abs(f) * SHRINK).toFixed(3);
      /* Fading starts just before a neighbour reaches the line and bottoms
         out at the edge, so the centred card is always the brightest. */
      const fade = Math.max(0, (Math.abs(d) - 0.25) / 0.7);
      const opacity = 1 - Math.pow(fade, 1.3);

      card.style.transform = `translate3d(0, ${vert}px, ${z}px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(${scale})`;
      card.style.opacity = opacity.toFixed(3);
      card.style.zIndex = String(Math.round((1 - q) * 100));
    });
  };

  const onScroll = () => {
    if (!raf) raf = requestAnimationFrame(update);
  };
  addEventListener("scroll", onScroll, { passive: true });
  addEventListener("resize", onScroll);
  update();
}

/* ---------- case study overlay ---------- */

const caseStudy = document.getElementById("caseStudy");
const caseStudyBody = document.getElementById("caseStudyBody");
const csKicker = document.getElementById("csKicker");
const csClose = document.getElementById("csClose");

let csTrigger = null;
let csCloseTimer = 0;

/* Hand-drawn SVG scenes for the Carex Sketches / Final Screens galleries.
   Each key is the `code` carried by entries in data/projects.js; the art is
   generated here so no image assets are needed and the palette always
   matches the theme. */
const CS_ART = {
  flow: () => `<svg viewBox="0 0 320 220" role="img" aria-label="Flow diagram">
    <rect x="18" y="18" width="284" height="184" rx="16" fill="#f6f9ff" stroke="#d5e2ff"/>
    <rect x="36" y="46" width="52" height="8" rx="4" fill="#c3d5fb"/>
    <rect x="36" y="80" width="64" height="60" rx="10" fill="#2563eb"/>
    <rect x="128" y="80" width="64" height="60" rx="10" fill="#eef4ff" stroke="#2563eb" stroke-width="2"/>
    <rect x="220" y="80" width="64" height="60" rx="10" fill="#eef4ff" stroke="#2563eb" stroke-width="2"/>
    <rect x="140" y="92" width="40" height="36" rx="6" fill="#c3d5fb"/>
    <path d="M100 110h28M192 110h24" stroke="#0ea5e9" stroke-width="3" stroke-linecap="round"/>
    <path d="M232 100l10 10-10 10" fill="none" stroke="#0ea5e9" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M112 100l-10 10 10 10" fill="none" stroke="#0ea5e9" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,
  hero: () => `<svg viewBox="0 0 320 220" role="img" aria-label="Hero composition">
    <rect x="18" y="18" width="284" height="184" rx="16" fill="#fff" stroke="#d5e2ff"/>
    <rect x="36" y="34" width="248" height="40" rx="10" fill="#f6f9ff"/>
    <circle cx="50" cy="54" r="4" fill="#ffb4ab"/><circle cx="64" cy="54" r="4" fill="#ffd97a"/><circle cx="78" cy="54" r="4" fill="#8ce29a"/>
    <rect x="96" y="45" width="110" height="18" rx="4" fill="#e4edff"/>
    <rect x="36" y="90" width="140" height="86" rx="10" fill="#2563eb"/>
    <rect x="196" y="90" width="88" height="12" rx="6" fill="#e4edff"/>
    <rect x="196" y="112" width="88" height="12" rx="6" fill="#e4edff"/>
    <rect x="196" y="134" width="60" height="12" rx="6" fill="#dbe6ff"/>
    <rect x="196" y="160" width="52" height="16" rx="8" fill="#0ea5e9"/>
  </svg>`,
  mobile: () => `<svg viewBox="0 0 320 220" role="img" aria-label="Mobile layout">
    <rect x="98" y="60" width="18" height="100" rx="9" fill="#eef4ff" stroke="#d5e2ff"/>
    <rect x="204" y="60" width="18" height="100" rx="9" fill="#eef4ff" stroke="#d5e2ff"/>
    <rect x="118" y="18" width="84" height="184" rx="20" fill="#fff" stroke="#d5e2ff" stroke-width="2"/>
    <rect x="132" y="36" width="56" height="10" rx="5" fill="#e4edff"/>
    <rect x="132" y="58" width="56" height="46" rx="8" fill="#2563eb"/>
    <rect x="132" y="114" width="56" height="10" rx="5" fill="#e4edff"/>
    <rect x="132" y="130" width="56" height="10" rx="5" fill="#dbe6ff"/>
    <rect x="132" y="146" width="40" height="10" rx="5" fill="#dbe6ff"/>
    <rect x="132" y="166" width="56" height="22" rx="11" fill="#0ea5e9"/>
  </svg>`,
  board: () => `<svg viewBox="0 0 320 220" role="img" aria-label="Board sketch">
    <rect x="18" y="18" width="284" height="184" rx="16" fill="#fff" stroke="#d5e2ff"/>
    <rect x="44" y="44" width="232" height="132" rx="6" fill="#f6f9ff" stroke="#c9d8f9"/>
    <path d="M44 110h232M160 44v132" stroke="#c9d8f9"/>
    <rect x="52" y="52" width="44" height="44" rx="8" fill="#2563eb"/>
    <rect x="224" y="52" width="44" height="44" rx="8" fill="#0ea5e9"/>
    <rect x="52" y="124" width="44" height="44" rx="8" fill="#efb7ff"/>
    <rect x="224" y="124" width="44" height="44" rx="8" fill="#ffd97a"/>
    <circle cx="104" cy="110" r="7" fill="#2563eb"/>
    <circle cx="216" cy="110" r="7" fill="#0ea5e9"/>
    <circle cx="160" cy="52" r="6" fill="#efb7ff"/>
    <circle cx="160" cy="168" r="6" fill="#2563eb"/>
    <circle cx="160" cy="110" r="11" fill="#fff" stroke="#2563eb" stroke-width="2"/>
  </svg>`,
  "screen-hero": () => `<svg viewBox="0 0 320 220" role="img" aria-label="Final hero screen">
    <rect x="18" y="18" width="284" height="184" rx="14" fill="#fff" stroke="#d5e2ff"/>
    <rect x="36" y="34" width="248" height="44" rx="10" fill="#f6f9ff"/>
    <circle cx="50" cy="56" r="4" fill="#ffb4ab"/><circle cx="64" cy="56" r="4" fill="#ffd97a"/><circle cx="78" cy="56" r="4" fill="#8ce29a"/>
    <rect x="150" y="46" width="42" height="8" rx="4" fill="#dbe6ff"/>
    <rect x="200" y="46" width="42" height="8" rx="4" fill="#dbe6ff"/>
    <rect x="36" y="96" width="60" height="12" rx="6" fill="#2563eb"/>
    <rect x="36" y="122" width="140" height="14" rx="7" fill="#e4edff"/>
    <rect x="36" y="144" width="160" height="14" rx="7" fill="#dbe6ff"/>
    <rect x="36" y="170" width="96" height="26" rx="13" fill="#0ea5e9"/>
  </svg>`,
  "screen-work": () => `<svg viewBox="0 0 320 220" role="img" aria-label="Final work screen">
    <rect x="18" y="18" width="284" height="184" rx="14" fill="#fff" stroke="#d5e2ff"/>
    <rect x="36" y="34" width="248" height="22" rx="8" fill="#f6f9ff"/>
    <rect x="38" y="70" width="74" height="116" rx="10" fill="#eef4ff" stroke="#d5e2ff"/>
    <rect x="126" y="70" width="74" height="116" rx="10" fill="#2563eb"/>
    <rect x="214" y="70" width="74" height="116" rx="10" fill="#eef4ff" stroke="#d5e2ff"/>
    <rect x="48" y="86" width="54" height="36" rx="6" fill="#dbe6ff"/><rect x="48" y="132" width="54" height="8" rx="4" fill="#dbe6ff"/><rect x="48" y="146" width="40" height="8" rx="4" fill="#e4edff"/>
    <rect x="136" y="86" width="54" height="36" rx="6" fill="#8cb2ff"/><rect x="136" y="132" width="54" height="8" rx="4" fill="#c3d5fb"/><rect x="136" y="146" width="40" height="8" rx="4" fill="#9ec1ff"/>
    <rect x="224" y="86" width="54" height="36" rx="6" fill="#dbe6ff"/><rect x="224" y="132" width="54" height="8" rx="4" fill="#dbe6ff"/><rect x="224" y="146" width="40" height="8" rx="4" fill="#e4edff"/>
  </svg>`,
  "screen-contact": () => `<svg viewBox="0 0 320 220" role="img" aria-label="Final contact screen">
    <rect x="18" y="18" width="284" height="184" rx="14" fill="#fff" stroke="#d5e2ff"/>
    <rect x="36" y="34" width="248" height="22" rx="8" fill="#f6f9ff"/>
    <rect x="40" y="72" width="130" height="8" rx="4" fill="#dbe6ff"/>
    <rect x="208" y="72" width="72" height="10" rx="5" fill="#e4edff"/>
    <rect x="40" y="92" width="130" height="8" rx="4" fill="#e4edff"/>
    <rect x="208" y="92" width="72" height="10" rx="5" fill="#dbe6ff"/>
    <rect x="40" y="124" width="130" height="44" rx="8" fill="#f6f9ff" stroke="#d5e2ff"/>
    <rect x="208" y="124" width="72" height="44" rx="8" fill="#0ea5e9"/>
    <rect x="40" y="180" width="60" height="16" rx="8" fill="#2563eb"/>
  </svg>`,
  "screen-play": () => `<svg viewBox="0 0 320 220" role="img" aria-label="In-progress play screen">
    <rect x="104" y="10" width="112" height="200" rx="22" fill="#fff" stroke="#d5e2ff" stroke-width="2"/>
    <rect x="120" y="26" width="80" height="168" rx="10" fill="#f6f9ff" stroke="#c9d8f9"/>
    <path d="M120 110h80M160 26v168" stroke="#c9d8f9"/>
    <rect x="126" y="32" width="30" height="30" rx="6" fill="#2563eb"/>
    <rect x="164" y="32" width="30" height="30" rx="6" fill="#0ea5e9"/>
    <rect x="126" y="148" width="30" height="30" rx="6" fill="#efb7ff"/>
    <rect x="164" y="148" width="30" height="30" rx="6" fill="#ffd97a"/>
    <circle cx="142" cy="110" r="5" fill="#2563eb"/>
    <circle cx="178" cy="110" r="5" fill="#0ea5e9"/>
    <circle cx="160" cy="40" r="4" fill="#ffd97a"/>
    <circle cx="160" cy="180" r="4" fill="#2563eb"/>
    <circle cx="150" cy="110" r="14" fill="#fff" stroke="#8cb2ff" stroke-width="2"/>
    <circle cx="143" cy="103" r="3.2" fill="#2563eb"/><circle cx="157" cy="110" r="3.2" fill="#2563eb"/><circle cx="150" cy="117" r="3.2" fill="#2563eb"/>
  </svg>`,
};

/* Carex-shaped write-up: hero + Overview (01), Challenges (02), Features
   (03), Process (04), User Persona (05), Eisenhower Matrix (06), Sketches
   (07), Final Screens (08). Every block is optional so a short project can
   ship a short case study. */
function caseHtml(p, i) {
  const c = p.caseStudy || {};
  const label = (no, text) => `<p class="cs-label mono"><b>${pad(no)}</b> ${text}</p>`;
  const sec = (no, text, body) => `<div class="cs-sec">${label(no, text)}${body}</div>`;

  const art = (item) => {
    if (item.img) return `<figure><img src="${item.img}" alt="${item.title}" loading="lazy" /><figcaption>${item.title}</figcaption></figure>`;
    const svg = CS_ART[item.code];
    if (svg) return `<figure>${svg()}<figcaption>${item.title}</figcaption></figure>`;
    return "";
  };

  const hero = `<div class="cs-hero">
      <p class="cs-kicker mono">${p.category} / ${pad(i + 1)}</p>
      <h2 class="cs-title">${p.title}</h2>
      ${c.lead ? `<p class="cs-sub">${c.lead}</p>` : ""}
      <ul class="cs-facts">${[
        c.role && `<li><b>Role</b> — ${c.role}</li>`,
        c.timeline && `<li><b>Timeline</b> — ${c.timeline}</li>`,
        c.tools?.length ? `<li><b>Tools</b> — ${c.tools.join(", ")}</li>` : "",
      ].filter(Boolean).join("")}</ul>
      ${c.metrics?.length ? `<div class="cs-metrics">${c.metrics.map((m) => `<div class="cs-metric"><b>${m.n}</b><span>${m.l}</span></div>`).join("")}</div>` : ""}
    </div>`;

  const overview = c.overview?.length ? sec(1, "Overview", c.overview.map((t) => `<p>${t}</p>`).join("")) : "";

  const listBlock = (no, text, cls, items) => sec(no, text, `<ul class="${cls}">${items.map((item, j) => `<li><span class="${cls === "cs-challenges" ? "cs-challenge-n" : "cs-feature-n"} mono">0${j + 1}</span><h4>${item.title}</h4><p>${item.body}</p></li>`).join("")}</ul>`);
  const challenges = c.challenges?.length ? listBlock(2, "Challenges", "cs-challenges", c.challenges) : "";
  const features = c.features?.length ? listBlock(3, "Features", "cs-features", c.features) : "";

  const process = c.process
    ? sec(4, "Process", `<div class="cs-process">${["discover", "define", "ideate", "design"].map((k) => {
        const s = c.process[k];
        return s ? `<div class="cs-step"><b>${k}</b><h4>${s.title}</h4><p>${s.body}</p></div>` : "";
      }).join("")}</div>`)
    : "";

  const personas = c.personas?.length
    ? sec(5, "User Persona", `<div class="cs-personas">${c.personas.map((per) => {
        const initials = per.name.trim().split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
        return `<article class="cs-persona">
          <span class="cs-ava" aria-hidden="true">${initials}</span>
          <h4>${per.name}</h4>
          <p class="cs-role">${per.role}</p>
          <p class="cs-quote">${per.quote}</p>
          <div class="cs-lists">
            ${per.goals?.length ? `<div><h5>Goals</h5><ul>${per.goals.map((g) => `<li>${g}</li>`).join("")}</ul></div>` : ""}
            ${per.pains?.length ? `<div><h5>Pains</h5><ul>${per.pains.map((g) => `<li>${g}</li>`).join("")}</ul></div>` : ""}
          </div>
        </article>`;
      }).join("")}</div>`)
    : "";

  const matrix = c.matrix
    ? sec(6, "Eisenhower Matrix", `<div class="cs-matrix">
        <div class="cs-quad cs-quad--1"><h4>Do first <span class="mono">urgent · important</span></h4><ul>${c.matrix.do.map((t) => `<li>${t}</li>`).join("")}</ul></div>
        <div class="cs-quad cs-quad--2"><h4>Schedule <span class="mono">not urgent · important</span></h4><ul>${c.matrix.schedule.map((t) => `<li>${t}</li>`).join("")}</ul></div>
        <div class="cs-quad cs-quad--3"><h4>Delegate <span class="mono">urgent · not important</span></h4><ul>${c.matrix.delegate.map((t) => `<li>${t}</li>`).join("")}</ul></div>
        <div class="cs-quad cs-quad--4"><h4>Let go <span class="mono">not urgent · not important</span></h4><ul>${c.matrix.drop.map((t) => `<li>${t}</li>`).join("")}</ul></div>
      </div>`)
    : "";

  const sketches = c.sketches?.length ? sec(7, "Sketches", `<div class="cs-art">${c.sketches.map(art).join("")}</div>`) : "";
  const screens = c.screens?.length ? sec(8, "Final Screens", `<div class="cs-art">${c.screens.map(art).join("")}</div>`) : "";

  const links = p.href ? `<div class="cs-links"><a class="btn btn-primary" href="${p.href}" target="_blank" rel="noopener">View live site ↗</a></div>` : "";
  const foot = `<div class="cs-foot">
      <span class="mono">Project ${pad(i + 1)} of ${pad(PROJECTS.length)}</span>
      <button type="button" class="casestudy-close" data-cs-close>Close case study</button>
    </div>`;

  return hero + overview + challenges + features + process + personas + matrix + sketches + screens + links + foot;
}

function openCaseStudy(p, i, trigger) {
  csTrigger = trigger || csTrigger;
  csKicker.textContent = `${p.category} / ${pad(i + 1)}`;
  caseStudyBody.innerHTML = caseHtml(p, i);
  caseStudyBody.scrollTop = 0;
  clearTimeout(csCloseTimer);
  caseStudy.hidden = false;
  /* Two rAFs so the browser paints the unhidden panel before .open triggers
     the entrance animation, otherwise the fade-in does not play. */
  requestAnimationFrame(() => requestAnimationFrame(() => caseStudy.classList.add("open")));
  document.body.style.overflow = "hidden";
  csClose.focus();
}

function closeCaseStudy() {
  if (caseStudy.hidden) return;
  caseStudy.classList.remove("open");
  document.body.style.overflow = "";
  csCloseTimer = setTimeout(() => {
    caseStudy.hidden = true;
  }, 520);
  /* Return focus to whatever opened it, so keyboard users are not dumped
     back at the top of the document. */
  csTrigger?.focus?.();
  csTrigger = null;
}

csClose.addEventListener("click", closeCaseStudy);
caseStudyBody.addEventListener("click", (e) => {
  if (e.target.closest("[data-cs-close]")) closeCaseStudy();
});
caseStudy.addEventListener("click", (e) => {
  if (e.target === caseStudy) closeCaseStudy();
});

/* Keep Tab inside the dialog while it is open. */
caseStudy.addEventListener("keydown", (e) => {
  if (e.key !== "Tab" || caseStudy.hidden) return;
  const focusables = caseStudy.querySelectorAll('button, [href], [tabindex]:not([tabindex="-1"])');
  if (!focusables.length) return;
  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !caseStudy.hidden) closeCaseStudy();
});

const nav = document.getElementById("nav");
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");
const progress = document.getElementById("progress");

const setMenu = (open) => {
  navLinks.classList.toggle("open", open);
  navToggle.setAttribute("aria-expanded", String(open));
  document.body.style.overflow = open ? "hidden" : "";
};

addEventListener("scroll", () => {
  nav.classList.toggle("scrolled", scrollY > 40);
  const max = document.documentElement.scrollHeight - innerHeight;
  progress.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
}, { passive: true });

navToggle.addEventListener("click", () => {
  setMenu(!navLinks.classList.contains("open"));
});
navLinks.addEventListener("click", (e) => {
  if (e.target.tagName === "A") setMenu(false);
});
/* Escape closes the mobile menu, same as it closes the lightbox. */
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && navLinks.classList.contains("open")) {
    setMenu(false);
    navToggle.focus();
  }
});

const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("in");
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

const counters = document.querySelectorAll("[data-count]");

/* Odometer counters. Each digit is a 0-9 rail that slides into place, which
   is the movement the reference uses for its animated numbers. The rails are
   built here rather than in markup so only the digits actually needed exist,
   and so a no-JS visitor sees nothing at all rather than a broken column.

   The rail is 10 glyphs tall and each step is translateY(-10%), i.e. exactly
   one glyph, so no measurement is involved and the digits stay aligned no
   matter which font actually loads. */
const RAIL = Array.from({ length: 10 }, (_, d) => `<i>${d}</i>`).join("");

const buildOdometer = (el, digits) => {
  el.textContent = "";
  const runs = [];
  for (let i = 0; i < digits; i++) {
    const col = document.createElement("span");
    col.className = "digit";
    const run = document.createElement("span");
    run.className = "digit-run";
    run.innerHTML = RAIL;
    col.appendChild(run);
    el.appendChild(col);
    runs.push(run);
  }
  return runs;
};

const setOdometer = (runs, value) => {
  const s = String(value).padStart(runs.length, "0");
  for (let i = 0; i < runs.length; i++) {
    runs[i].style.transform = `translateY(${-Number(s[i]) * 10}%)`;
  }
};

const co = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = +el.dataset.count;
    co.unobserve(el);

    if (Number.isNaN(target) || target <= 0) return;

    const runs = buildOdometer(el, String(target).length);

    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setOdometer(runs, target);
      return;
    }

    /* ~1.1s of travel, spaced wider than the 0.42s CSS transition so no digit
       is still sliding when the next one is requested. */
    const per = Math.max(1, Math.ceil(target / 16));
    let n = 0;
    const timer = setInterval(() => {
      n = Math.min(target, n + per);
      setOdometer(runs, n);
      if (n >= target) {
        setOdometer(runs, target);
        clearInterval(timer);
      }
    }, 70);
  });
}, { threshold: 0.5 });
counters.forEach((el) => co.observe(el));

/* ---------- contact form ---------- */

const form = document.getElementById("contactForm");
const status = document.getElementById("formStatus");

const setStatus = (msg, kind) => {
  status.textContent = msg;
  status.className = `form-status mono ${kind}`;
};

const sendViaMailto = (name, email, message) => {
  const subject = encodeURIComponent(`Project enquiry from ${name}`);
  const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
  location.href = `mailto:${CONFIG.email}?subject=${subject}&body=${body}`;
  setStatus("Opening your email app. If nothing opens, email me directly below.", "ok");
  form.reset();
};

/* Netlify Forms turns a plain HTML form into a real endpoint and emails you
   every submission — no backend, no paid service. It only exists once the
   site is deployed to Netlify, so anywhere else we fall back to mailto. */
const ON_NETLIFY = /(^|\.)netlify\.app$/.test(location.hostname);

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  /* Honeypot: bots fill every field they find. Real people never see it. */
  if (form.elements["bot-field"]?.value) return;

  const data = new FormData(form);
  const name = String(data.get("name") || "").trim();
  const email = String(data.get("email") || "").trim();
  const message = String(data.get("message") || "").trim();

  if (!name || !message) {
    setStatus("Please fill in your name and a few details about the project.", "err");
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    setStatus("That email address doesn't look right.", "err");
    return;
  }

  if (!ON_NETLIFY) {
    sendViaMailto(name, email, message);
    return;
  }

  const btn = form.querySelector('button[type="submit"]');
  const label = btn.textContent;
  btn.disabled = true;
  btn.textContent = "Sending…";

  try {
    const res = await fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(data).toString(),
    });
    if (!res.ok) throw new Error(String(res.status));
    setStatus("Sent. I reply within a day.", "ok");
    form.reset();
  } catch {
    sendViaMailto(name, email, message);
  } finally {
    btn.disabled = false;
    btn.textContent = label;
  }
});

/* ---------- resume link ---------- */
/* Hidden automatically if the PDF is not there, so there is never a dead
   download on the page. */
const cvLink = document.querySelector("[data-cv]");
if (cvLink) {
  fetch(cvLink.getAttribute("href"), { method: "HEAD" })
    .then((r) => {
      if (!r.ok) cvLink.remove();
    })
    .catch(() => {
      /* Network or CORS blocked the check — leave the link in place rather
         than hiding something that might work. */
    });
}

document.getElementById("year").textContent = new Date().getFullYear();
