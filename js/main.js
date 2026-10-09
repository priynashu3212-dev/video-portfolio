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

let visible = PROJECTS.map((_, i) => i);

const hasLink = (p) => Boolean(p.href);
const hasVideo = (p) => Boolean(p.src);
const isStatic = (p) => !hasLink(p) && !hasVideo(p);

function buildCard(p, i) {
  const card = document.createElement("li");
  const interactive = !isStatic(p);
  card.className = interactive ? "card reveal" : "card card--static reveal";
  card.dataset.category = p.category;
  card.dataset.index = i;
  card.style.transitionDelay = `${(i % 3) * 0.08}s`;

  const meta = [p.client, p.year].filter(Boolean).join(" · ");
  const cta = hasVideo(p) && !hasLink(p) ? "▶" : "↗";

  card.innerHTML = `
    <span class="card-media">
      <img src="${p.poster}" alt="" loading="lazy" width="640" height="480" />
      <span class="card-no mono">${pad(i + 1)}</span>
      <span class="card-cat mono">${p.category}</span>
    </span>
    <span class="card-body">
      <span class="card-title">${p.title}</span>
      ${p.summary ? `<span class="card-summary">${p.summary}</span>` : ""}
      ${
        p.result
          ? `<span class="card-result"><span class="card-result-tag mono">Result</span>${p.result}</span>`
          : ""
      }
      ${p.stack ? `<span class="card-stack mono">${p.stack}</span>` : ""}
      <span class="card-meta mono">${meta}</span>
    </span>
    ${interactive ? `<span class="card-go" aria-hidden="true">${cta}</span>` : ""}`;

  if (!interactive) {
    card.setAttribute("aria-disabled", "true");
    return card;
  }

  /* A real <button> rather than a div with role="button", so it is reachable
     by keyboard, announced correctly, and activates on Enter and Space
     without any hand-rolled key handling. */
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "card-hit";
  btn.setAttribute("aria-label", `${p.title} — ${hasVideo(p) ? "play video" : "open project"}`);
  btn.addEventListener("click", () => {
    if (hasLink(p)) {
      window.open(p.href, "_blank", "noopener noreferrer");
    } else {
      openLightbox(p, i, btn);
    }
  });
  card.appendChild(btn);
  return card;
}

/* replaceChildren, not appendChild: index.html carries the same cards baked
   in for crawlers and no-JS visitors, so the list must be cleared first or
   every card would appear twice. */
workList.replaceChildren(...PROJECTS.map((p, i) => buildCard(p, i)));

/* Hide any filter chip that would show an empty grid. Better than a button
   that filters to nothing. */
document.querySelectorAll("#filters .chip").forEach((chip) => {
  const f = chip.dataset.filter;
  if (f === "all") return;
  if (!PROJECTS.some((p) => p.category === f)) chip.remove();
});

const filters = document.getElementById("filters");
filters.addEventListener("click", (e) => {
  const chip = e.target.closest(".chip");
  if (!chip) return;
  document.querySelectorAll(".chip").forEach((c) => c.classList.remove("is-active"));
  chip.classList.add("is-active");
  const f = chip.dataset.filter;
  visible = [];
  document.querySelectorAll(".card").forEach((card) => {
    const show = f === "all" || card.dataset.category === f;
    card.classList.toggle("is-hidden", !show);
    if (show) visible.push(+card.dataset.index);
  });
});

const lightbox = document.getElementById("lightbox");
const lbVideo = document.getElementById("lightboxVideo");
const lbStill = document.getElementById("lightboxStill");
const lbMeta = document.getElementById("lightboxMeta");
const lbCount = document.getElementById("lbCount");
const lbClose = document.getElementById("lightboxClose");

let currentIndex = -1;
let lastTrigger = null;

function openLightbox(p, i, trigger) {
  currentIndex = i;
  if (trigger) lastTrigger = trigger;
  const hasVideo = Boolean(p.src);

  lbVideo.classList.toggle("is-hidden", !hasVideo);
  lbStill.hidden = hasVideo;
  lbStill.src = p.poster;
  lbStill.alt = p.title;

  if (hasVideo) {
    if (lbVideo.getAttribute("src") !== p.src) lbVideo.src = p.src;
    lbVideo.poster = p.poster;
  }

  const parts = [p.title, [p.category, p.client, p.year].filter(Boolean).join(" · ")];
  if (p.duration) parts.push(p.duration);
  if (p.summary) parts.push(p.summary);
  lbMeta.textContent = parts.join("  —  ");
  lbCount.textContent = `${pad(i + 1)} / ${pad(PROJECTS.length)}`;
  lightbox.classList.add("open");
  document.body.style.overflow = "hidden";
  lbClose.focus();
  if (hasVideo) lbVideo.play().catch(() => {});
}

function closeLightbox() {
  if (!lightbox.classList.contains("open")) return;
  lightbox.classList.remove("open");
  lbVideo.pause();
  lbVideo.removeAttribute("src");
  lbVideo.load();
  document.body.style.overflow = "";
  currentIndex = -1;
  /* Return focus to whatever opened it, so keyboard users are not dumped
     back at the top of the document. */
  lastTrigger?.focus();
  lastTrigger = null;
}

function step(dir) {
  if (!lightbox.classList.contains("open") || !visible.length) return;
  const at = visible.indexOf(currentIndex);
  const next = visible[(at + dir + visible.length) % visible.length];
  openLightbox(PROJECTS[next], next);
}

lbClose.addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox || e.target.closest(".lightbox-top") === e.target) closeLightbox();
});

/* Keep Tab inside the dialog while it is open. */
lightbox.addEventListener("keydown", (e) => {
  if (e.key !== "Tab") return;
  const focusables = lightbox.querySelectorAll(
    'button, [href], input, select, textarea, video[controls], [tabindex]:not([tabindex="-1"])'
  );
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
  if (e.key === "Escape") closeLightbox();
  if (lightbox.classList.contains("open")) {
    if (e.key === "ArrowRight") step(1);
    if (e.key === "ArrowLeft") step(-1);
  }
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
