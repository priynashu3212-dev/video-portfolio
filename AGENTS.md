# opencode / agent notes

This document is a running checklist/notes file so future opencode runs
(and you) know exactly what state this codebase is in and what you should
do next. Add to it when you discover something useful.

## What we did so far (Oct 1, 2026)

- Hero background video (assets/hero-loop.*):

  **What it actually is:** a procedural flow-field / aurora
  video. A WebGL fragment shader was rendered to frames via Chrome DevTools and
  then encoded to webm/mp4. Visually it is warm cream-to-taupe flowing liquid
  (silk / marbled ink drifting), with thin bright filament ridges, a terracotta
  light pool in the upper right reading as sunlight from an off-frame window,
  plus subtle film grain and a soft vignette. The loop is seamless because the
  shader drifts on a circular path, so frame 96 flows back into frame 1.

  It is **not** real-world footage: no camera footage, no people, no stock clip,
  entirely mathematically generated motion. `js/aurora.js` is the same shader
  running live, used as the fallback when the video cannot load.

  Encoding details:
  - Rendered 96 WebGL frames via Chrome DevTools (one-page loop with circular drift, seam-free)
  - Encoded `assets/hero-loop.webm` (VP9, CRF 26, ~251 KB) and `assets/hero-loop.mp4` (H.264, CRF 22, ~796 KB), plus `assets/hero-poster.jpg` (~39 KB)
  - Verified SSIM 0.983 (webm) / 0.980 (mp4), proper dimensions, smooth frame-to-frame continuity, exact loop seam (0.00 diff between first and last frame)
- Rebuilt theme for a Squarespace-inspired warm editorial look:
  - Light palette: --bg #f7f5f0, --bg-2 #efebe3, --surface #fffdf8, --text #1c1613, --muted #6f6759, accent --accent #1c1613, terracotta --accent-2 #a4572f
  - Hero shader tokens --mid #ece0cc, --deep #b39471, --warm #e8c489, --dark #7d5636
  - Serif display accents (Instrument Serif) for the hero accent word and card titles
  - Editorial buttons, lighter nav, light theme-color #f7f5f0, updated favicon
- Hero: video layer over live WebGL fallback with hand-off on canplay; reduced-motion stops autoplay and leaves poster visible.
- Work cards: alternating -3.4deg/+3.1deg tilt with uneven vertical stagger (--drop 0/30/14/4px), warm cursor glow, serif titles. Static cards keep tilt but lose lift/arrow.
- Counters: 0-9 odometer rails with baseline-aligned suffix; fall back to final values under reduced-motion.
- Removed the fabricated "12+ Projects shipped" claim.

## Why the hero looked like "only colour changes"

This turned out to be two separate causes, both measured rather than guessed.

**1. The scrim was destroying the contrast.** `.hero-scrim` washed the entire
hero at roughly 35% average alpha, which compressed the backdrop's spatial
standard deviation from about 14 down to 8. Measured with all hero content
hidden, and with `.hero-media` fully hidden as the flat baseline:

| state | mean | SD |
|---|---|---|
| flat page, no artwork | 245 | 0.0 |
| video playing, original scrim | 233 | 8.0 |
| video playing, tightened scrim | 231 | 10.6 |

SD 8/255 is a barely-perceptible tint. The scrim could not simply be removed,
because `--muted` hero-bar text only reaches 1.6:1 contrast over the troughs,
so it is now confined to the headline column and the bottom bar, and the right
half of the frame keeps the artwork at full contrast. The shader was also
deepened (source-frame mean 222 -> ~205, SD ~8 -> ~16) so the artwork has real
depth instead of reading as a colour wash.

**2. Stale caching, in two places.** `server.js` served `.mp4`/`.webm` with
`Cache-Control: public, max-age=3600` while everything else got `no-cache`,
so a re-encoded hero video stayed invisible for up to an hour. Now `no-store`
on all responses, since this is a local preview server.

Fixing the header alone was not enough, though: a browser can keep an
already-parsed copy from before the header changed, and only a changed URL
guarantees invalidation. Every asset reference in `index.html` (stylesheet,
scripts, poster, both video sources) therefore carries a `?v=2` stamp. **Bump
these whenever an asset's contents change.** A URL change is the only reliable
invalidation; a header change alone can leave a stale copy in place.

Symptom to recognise: the server serves the new bytes and the right cache
header, verification against a fresh headless profile passes, but the page in
a real browser still looks unchanged. Confirm with
`Invoke-WebRequest http://localhost:5173/css/style.css` and grep for a known
new value before assuming the edit failed.

To avoid repeating this class of mistake: never judge a background or
animation change from memory. Measure the rendered pixels (spatial SD, and
frame-to-frame difference) and confirm the bytes served match the bytes on
disk.

## Verified

- Reduced motion: video paused, autoplay removed, video opacity 0, aurora
  hidden, poster visible, marquee/dot animations off.
- Video unreachable: with `*hero-loop*` blocked the media request fails,
  `readyState` 0, no `is-ready`, video opacity 0, and the WebGL aurora takes
  over. Confirmed it is genuinely painting (SD 14.4, and it changes between
  frames 4.86/255) by screenshotting the page. Note that reading the canvas
  back directly returns all zeros because the context is created without
  `preserveDrawingBuffer`, and a second `getContext()` call returns null.
- Blocking test gotcha: blocking an asset and then re-navigating to an
  identical URL lets Chrome satisfy the media request from the memory cache,
  so the check appears to pass while the video loaded normally. Use a
  cache-buster query param plus `Network.setCacheDisabled`.
- Contrast: all text >= 4.7:1, display 16.42:1, serif accent 4.84:1.
- No horizontal overflow at 1440x900 or 390x844; no console errors; no failed
  requests; JS syntax clean across aurora.js, config.js, main.js, projects.js.

## Current state

- Live at http://localhost:5173/
- ffmpeg lives at
  `C:\Users\Admin\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-9.0.1-full_build\bin\ffmpeg.exe`
- Stats: 4 mo, 10+ Tools in the stack, 100% Self-taught
- Contact details live: CONFIG.email `bhanupartap1790@gmail.com`, CONFIG.phone
  `+91 87085 51762`, CONFIG.whatsapp `918708551762`. Contact section renders a
  Phone/Email/WhatsApp/Location grid from CONFIG (`#contactDetails` in main.js);
  footer shows email + phone.
- Contact section photo `assets/photos/kaithal-aerial.jpg` is now **the user's
  own drone shot**, converted from `C:\Users\Admin\Downloads\drone.webp`
  (webp -> jpg, ffmpeg `-q:v 4`). Source is only **480x270 / 22 KB**, so it
  renders a bit soft at contact-column width — ask for a higher-res export
  when possible. CSS uses `height:auto` (no fixed aspect-ratio), so any
  replacement keeps its own proportions. The old CC BY stand-in (Mohali
  aerial, credit line) is gone.
- Wikimedia rate-limits (429) bulk downloads — use
  `Special:FilePath/<name>?width=1600` with a real User-Agent and sleeps.
- js/config.js `now`, `journey`, `faq` arrays are now wired: sections
  "Right now" (after About), "Journey" (after Process), "FAQ" (before Contact)
  render from them in main.js. Section labels are renumbered at runtime after
  the optional testimonials/now/journey/faq sections settle, so no gaps.
- Git repository initialized; commits now on `master`.
- **GitHub remote:** `origin` → https://github.com/priynashu3212-dev/video-portfolio
  (public, branch `master`). Auth uses Git Credential Manager (browser OAuth);
  the repo-local `credential.https://github.com.helper=manager` overrides a
  stale fine-grained token in `.git-credentials` that lacked Contents write on
  this repo. `git push` works.

## SEO pass (Oct 7, 2026)

Target keywords: **"Priyanshu Rana"** and **"Priyanshu Siwan"** (name + village,
Kaithal). Goal is #1 for the name search.

- `robots.txt` created (root) and already live:
  `User-agent: * / Allow: / / Sitemap: https://video-portfolio-eta-two.vercel.app/sitemap.xml`
- `index.html` head reworked:
  - Title: `Priyanshu Rana — Digital Marketing with AI & Web Developer in Siwan, Kaithal`
  - Meta description leads with the name + "Siwan, Kaithal, Haryana"
  - **Canonical + og:url added** → `https://video-portfolio-eta-two.vercel.app/`
    (replaced the "add a domain later" placeholder comment)
  - og:image / twitter:image changed from relative to **absolute URLs**
    (relative ones don't render in link previews)
- Person JSON-LD: added `alternateName: ["Priyanshu Siwan", "Priyanshurana"]`,
  `url`, `homeLocation` "Siwan, Kaithal, Haryana", `addressLocality`
  "Siwan, Kaithal"
- Added a second JSON-LD block: **FAQPage** mirroring the 6 CONFIG.faq entries
  (keep in sync with js/config.js if FAQ text changes)
- H2 "About" → "About Priyanshu Rana"
- Portrait `alt` now keyword-bearing; hero sub and FAQ answer say
  "Siwan, Kaithal" instead of just Kaithal
- Both JSON-LD blocks verified valid (parse-checked); page 200 at :5173

**On-page alone won't hit #1** — remaining off-page steps are in Next actions.

## SEO pass 2 — keyword targeting + raw-HTML bake (Oct 8, 2026)

Target queries: **"priyanshu rana"**, **"priyanshu siwan"**, **"priyanshu kaithal"**,
**"priyanshu digital marketer student"**.

### On-page changes

- Title → `Priyanshu Rana — Digital Marketer & Web Developer Student, Siwan Kaithal`
  (72 ch); meta/og/twitter descriptions rewritten to contain the exact phrase
  "digital marketer student" + "Siwan, Kaithal, Haryana" (158 ch).
- **Removed the `document.title`/meta/og override block at the top of
  main.js.** It rewrote the head from CONFIG at runtime, so JS-rendering
  crawlers saw a different title than the source. `index.html` head is now the
  single source of truth — never set document.title or the meta tags from JS.
- H1 contains "Priyanshu Rana — " via a `.sr-only` span (new utility class in
  style.css). The H1 is rebuilt from `CONFIG.heroLines` at load, so the sr-only
  span lives in **both** index.html and config.js — change them together.
- `heroSub` and `CONFIG.aboutBody[0]` rewritten with name/location/role
  keywords. About paragraphs are overwritten from config at load — static HTML
  must mirror the config text.
- 2 new name-intent FAQs: "Who is Priyanshu Rana?" and "Where is Priyanshu
  Rana from?" — kept in **three** places: `CONFIG.faq`, the static FAQPage
  JSON-LD block, and the baked `#faqList` markup.
- Person JSON-LD `sameAs` → Instagram `https://www.instagram.com/bhanu.rana___/`;
  `CONFIG.socials` Instagram is real (LinkedIn/YouTube/X still "#").
- Stats odometer template now writes the **final value**, not `0` — the old
  `>0<` meant rendering crawlers saw "0mo In digital marketing".

### Raw-HTML bake (the big one)

- Every config-driven section (stats, skills, services, process, now, journey,
  FAQ, contact details, footer socials, both project cards) is baked into
  index.html with the exact markup main.js produces. main.js still overwrites
  them at load with identical content — the bake exists for crawlers,
  scrapers and no-JS visitors.
- **Sync rule: when an array in config.js/projects.js changes, update the
  matching baked markup in index.html too.** A comment above the stats section
  says so in the page itself.
- `#workList` builds via `replaceChildren()` now, not `appendChild()` —
  otherwise the baked cards doubled up.
- Testimonials section removed from static HTML (JS removes it at runtime when
  the array is empty); baked section labels are the post-renumber 01..09
  (FAQ 08, Contact 09); Campaign/Content filter chips dropped (no such
  projects); lightbox counter reads "01 / 02".
- `?v=` stamps bumped: style.css **v6**, config.js **v4**, main.js **v4**.

### Verified (local AND live)

- `seo-verify.mjs`: 10/10 assertions + full JS-vs-no-JS parity (counts and
  normalized text) — both localhost and the live URL.
- `seo-geom.mjs`: every image loads, no zero-height sections, card tilt
  (-3.4°/+3.1°) and stagger intact, no horizontal overflow — local and live.
- Live raw source: 27× "Priyanshu Rana", 3× "digital marketer student", 8
  baked FAQ items, both JSON-LD blocks parse, google verification file 200,
  sitemap lastmod 2026-10-08, all `?v=` stamps present.
- `check-aurora-fallback.mjs` still passes (SD ~13, frame-to-frame diff 6.6 —
  genuinely animating); hero2 contrast matches the recorded table
  (bare-flat 244.0/0.0, bare-poster 215.8/11.7).
- Deployed with `vercel --prod`; alias unchanged.

### Known quirks found on the way

- **server.js ignores HTTP Range** (answers 200, never 206), so video seeking
  fails on localhost — `currentTime` snaps to 0 and hero measurement
  screenshots show a frozen frame. Playback works; the live site seeks fine
  (verified). Never diagnose video problems from localhost seeking.
- Odometer rails inject digits 0-9 into textContent once counters run —
  pre-existing, only after scroll; crawlers that don't scroll see the final
  value.

## CV + local server MIME (Oct 9, 2026)

- Generated `assets/Priyanshu-Rana-CV.pdf` (single A4 page, ~72 KB) so the
  "Download CV" button finally activates (it hides itself while the file is
  missing — `main.js` HEAD-checks `[data-cv]`).
- Source template kept at `assets/cv/Priyanshu-Rana-CV.html`; regenerate with
  Chrome headless:
  `& "C:\Program Files\Google\Chrome\Application\chrome.exe" --headless=new --disable-gpu --no-pdf-header-footer --virtual-time-budget=3000 --print-to-pdf="assets\Priyanshu-Rana-CV.pdf" "file:///<abs>/assets/cv/Priyanshu-Rana-CV.html"`
  (Chrome logs "N bytes written" to stderr; PowerShell shows it as red text —
  it is not an error.) Verify the page count by grepping the PDF for `/Count`.
- `assets/cv/` is in `.vercelignore`, so only the PDF ships, not the template.
- Content is assembled **only from facts already on the site** (skills,
  services, both projects, education = 10th/12th CBSE + first-year ongoing,
  four-month self-taught journey). **Review before sending** — add the college
  name, course and years if wanted; the template is the place to edit.
- `server.js` MIME map was missing `.pdf`, `.xml`, `.txt`; robots.txt and
  sitemap.xml were being served as `application/octet-stream` locally. Added —
  restart the server to pick it up (this is a `no-store` preview server, but
  the MIME map is read once at boot).

### Remaining items that cannot be finished from this machine

These need the owner's accounts, files or URLs — no code change will complete
them: Google Search Console + Bing verification, Instagram/LinkedIn/YouTube/X
profile URLs (replace the `#` in `CONFIG.socials` *and* the Person JSON-LD
`sameAs`), the Ludo Play Store/demo URL, and a higher-resolution drone photo
(the only source, `Downloads\drone.webp`, is still 480×270).

## SEO pass 3 — entity schema + name profile page + first backlink (Oct 9, 2026)

- **Person JSON-LD upgraded to a `ProfilePage`** on `index.html` (block 0): the
  `Person` is now `mainEntity`, enriched with `@id` `#person`, an `image` array
  (portrait + og-cover, absolute URLs), `nationality: India`, `knowsLanguage`
  (Hindi/English), `email`, `telephone`, `hasOccupation` (Occupation +
  skills), `mainEntityOfPage`, and expanded `alternateName`
  (`Priyanshu Siwan`, `Priyanshurana`, `Priyanshu Rana Siwan`,
  `Priyanshu Rana Kaithal`). `FAQPage` block unchanged. Both parse-checked.
- **New page `priyanshu-rana.html`** (dedicated name-targeted about/profile
  page): unique content ("Who is Priyanshu Rana?", quick facts, services,
  selected work, contact), its own canonical, `ProfilePage` + `BreadcrumbList`
  JSON-LD (Person `@id` matches the homepage), and links back to `/`. Standalone
  `<style>` (no dependency on style.css/main.js) so nothing else can break it.
  Linked from the homepage footer (`.footer-about` -> `priyanshu-rana.html`,
  new CSS in style.css) and added to `sitemap.xml` (priority 0.8, lastmod
  2026-10-09).
- **First real backlink:** added a "Website by Priyanshu Rana" footer credit
  link on the live **Fitplay Gym Kaithal** site
  (`https://fitplay-gym.vercel.app/`) pointing at the portfolio. See that
  repo's `AGENTS.md` S29. This is the "easiest real backlink" from the old
  Next-actions list — done.
- Commit `34996f9` pushed to `master`; deployed `vercel --prod` and verified
  live: `/priyanshu-rana.html` 200, `ProfilePage` present, canonical correct,
  homepage footer link present. Local `seo-verify.mjs` 10/10 + full JS/no-JS
  parity still passes; `seo-geom.mjs` GEOM OK.
- `ld-check.mjs` (temp) parses and reports the JSON-LD blocks in both HTML files.

## Portrait crop + priyanshu-rana circle fix (Oct 9, 2026)

- Commit `c1755ae` (prior session, previously unlogged) physically cropped
  `assets/photos/portrait.jpg` from the full-body 1200x1600 WhatsApp shot to an
  **upper-body 720x900** crop (removed the legs), bumped `style.css` to `?v=7`
  and the portrait references to `?v=2`, set `.about-photo--main img` to
  `object-position: 50% 50%`, and added the `Priyanshu Kaithal` alternateName +
  the "Is Priyanshu Rana also known as Priyanshu Siwan or Priyanshu Kaithal?"
  FAQ (config.js, FAQPage JSON-LD, baked `#faqList`). Committed, pushed, and
  deployed live; homepage + `/priyanshu-rana.html` verified.
- **c1755ae changed `js/config.js` but did NOT bump its `?v=` stamp**, so
  `index.html` now carries `js/config.js?v=5` (was `?v=4`). Bump the stamp
  whenever config.js changes — `main.js` re-renders `#faqList` from
  `CONFIG.faq`, so a cached config.js shows the old FAQ count.
- **Fixed the `priyanshu-rana.html` avatar crop.** The portrait's face sits in
  the top ~15-28% of the 720x900 frame. The 150x150 circle used `object-fit:
  cover` with default centre framing, which cropped the top and pushed the face
  off the top edge (reads as "body only"). Added `object-position: 50% 0` to
  `.portrait` so the circle anchors to the face. (The homepage hero 3:4 frame
  and the About 4:5 frame already show the full height, so only the 1:1 circle
  needed it.)
- **LinkedIn skipped** — the URL the owner sent (`linkedin.com/feed/`) is a
  private feed link, not a public profile. `CONFIG.socials` LinkedIn and the
  Person JSON-LD `sameAs` still need the real `linkedin.com/in/...` URL.
- Verified: `seo-verify.mjs` 10/10 + full JS/no-JS parity (9 FAQs both sides),
  `seo-geom.mjs` GEOM OK, both pages 200 at :5173.

## About-section photo crop (Oct 9, 2026)

- The homepage About photo (`.about-photo--main img`) was showing the **whole
  portrait** — head at the top plus the lower body/legs at the bottom — because
  `portrait.jpg` is 4:5 (720x900) and the `.about-photo img` frame is also
  `aspect-ratio: 4/5`, so `object-fit: cover` fit it exactly (no crop at all).
  The hero frame is 3:4, so it cropped the sides; the About frame did not.
- Fix: added a dedicated **upper-body crop `assets/photos/portrait-about.jpg`**
  (328x410, 4:5) taken from `portrait.jpg` (source rect x196 y20 w328 h410 —
  head/shoulders/upper torso, legs excluded) and pointed the About `<img>` at
  it (width 328 height 410). The hero and the `priyanshu-rana.html` circle keep
  the full `portrait.jpg`; only the About section was changed.
- Note: the 1200x1600 source (`%TEMP%\opencode\portrait-full.jpg` /
  the WhatsApp JPEG) is **not** a plain scale of `portrait.jpg` (mean abs diff
  ~54 at scale 0.6), so crops must be derived from `portrait.jpg` itself, not
  mapped to the original.
- `portrait-about.jpg` is a **new filename** (no `?v=` stamp needed) so it is
  cache-proof; bump the stamp only if the file is re-edited in place.

## About-section photo removed (Oct 9, 2026)

- Owner asked to **remove the About photo entirely** (the crop was never
  satisfying him). Deleted the whole `.about-photos` / `.photo-grid` /
  `.about-photo` figure from `index.html`, deleted the now-unused
  `assets/photos/portrait-about.jpg`, and dropped the dead
  `.about-photo*` / `.photo-grid` rules from `style.css` (incl. the 420px
  media-query rule).
- `.about` is now a **single column** (`grid-template-columns: minmax(0,1fr)`)
  and `.about-text` is capped at `70ch` so the paragraph doesn't run full
  width. `style.css` stamp bumped to **?v=8**.
- The hero portrait and the `priyanshu-rana.html` circle are untouched and
  still use `portrait.jpg?v=2`. `main.js` still has the
  `document.querySelectorAll(".about-photo img")` error fallback — it now
  matches nothing, harmless.
- If a photo is wanted here again, add a figure inside the `.about` grid and a
  real portrait to `assets/photos/`.

## Next actions

**Off-page — this is what actually wins name searches (on-page alone will
not get #1):**

1. **Google Search Console**: add property
   `https://video-portfolio-eta-two.vercel.app` (verification file
   `google5b3de35788edf0b8.html` is live, returns 200), submit
   `sitemap.xml`, then URL Inspection → Request indexing on the homepage.
   After ~2 weeks, check Performance → queries for the four target searches.
2. **Bing Webmaster Tools** — can import straight from GSC; covers
   Bing/Copilot.
3. **Instagram** (`bhanu.rana___`): display name "Priyanshu Rana", bio with
   "digital marketer · Siwan, Kaithal", site link in bio. The JSON-LD
   `sameAs` already points at it — but the profile must link *back*.
4. **Backlinks he controls**: "Website by Priyanshu Rana" credit link to the
   portfolio on `fitplay-gym.vercel.app` (and any future school/client sites).
   Easiest real backlink available.
5. **Next profiles**, then add their URLs to `CONFIG.socials` *and* the
   Person JSON-LD `sameAs` array: LinkedIn, YouTube (a video titled
   "Priyanshu Rana" ranks fast for name searches), GitHub,
   Linktree/About.me.
6. Same name + same photo on every profile — entity building, the path to a
   Knowledge Panel. No bought links or comment spam: new sites get penalized.

**Still open from before:**

1. Higher-resolution drone photo (current 480x270).
2. Ludo project href when published.
3. Custom domain later means updating: robots.txt, sitemap.xml, canonical,
   og:url, Person JSON-LD (5 places).

## Quick checks

- node --check js/*.js data/*.js
- node server.js from repo root, http://localhost:5173/
- Hero/backdrop contrast + motion: `node %TEMP%\opencode\measure-hero2.mjs`
- Video fallback: `node %TEMP%\opencode\check-aurora-fallback.mjs`
- **SEO/bake assertions + JS/no-JS parity: `node %TEMP%\opencode\seo-verify.mjs [url]`**
- **Layout/images sanity: `node %TEMP%\opencode\seo-geom.mjs [url]`**
- **Section screenshots (need human eyes): `node %TEMP%\opencode\seo-shots.mjs`**
- **Deck + case-study interaction: `node %TEMP%\opencode\test-deck.mjs`**
- Re-encoding the hero: edit `loopframe.html`, `node render-loop.mjs`, then the
  ffmpeg calls above. Grade single frames first with `node probe-frames.mjs 0.0 0.5`
  (a full render is ~4 minutes).

## Blue theme + 3D scroll deck + Carex case studies (Oct 9, 2026)

The owner asked for the work projects to follow the "Carex UX Case Study
Template v1.1" structure (Overview / Challenges / Features / Process
Discover·Define·Ideate·Design / User Persona / Eisenhower Matrix / Sketches /
Final Screens), opened from an interactive project card with a smooth
transition, plus a scroll-driven 3D deck for the projects (tilted cards that
straighten at centre-screen, parallax layers, hover lift, opening a full case
study). The owner explicitly chose the brief's look — **white/light-blue
background, bright blue accent, rounded cards, soft shadows, Poppins** — over
the old warm editorial theme.

- **Theme is now blue** (supersedes the warm palette in the Oct 1 notes):
  `--bg #f4f7ff`, `--bg-2 #e9effb`, `--surface #fff`, `--line #d9e1f3`,
  `--text #0f1e3d`, `--muted #5c6b8f`, `--accent #2563eb`, `--accent-2 #0ea5e9`,
  hero shader `--mid #cddbff / --deep #7aa2ff / --warm #a5c4ff / --dark #3b5bd6`,
  `--radius 18px`, fonts Poppins + JetBrains Mono, blue SVG favicon,
  theme-color `#f4f7ff`.
- **The encoded hero-loop video is still the old WARM cream-taupe grade**.
  The live WebGL shader now reads the blue tokens (aurora.js reads CSS vars at
  runtime), so the video and the fallback no longer match. Known follow-up:
  re-encode hero-loop.webm/mp4 in the blue palette
  (`edit loopframe.html` → `node render-loop.mjs` → ffmpeg). Do NOT trust
  localhost seeking (server.js ignores Range) — judge from the live site.
- **Work section = 3D scroll deck** when JS runs and reduced-motion is off:
  `main.js` builds `.stack > .stack-viewport > (.stack-bgs + .stack-stage)`
  inside `#workWrap`, moves `#workList` into `.stack-stage`, adds `.is-deck` to
  `<section class="work">`. One rAF-throttled scroll handler writes ONLY
  transform + opacity per card plus parallax on the 3 `.stack-bg` blobs.
  Physics: `p = -stack.top/travel`, `t = p*(n+0.4)/n`, per-card
  `d = t - (i+0.5)/n`, eased with `tanh`; cards centre one after another;
  on <760px amplitude ×0.45; reduced-motion/`<2` projects fall back to the
  static staggered grid (no `.is-deck`). CSS expects the perspective on
  `.work.is-deck .card-grid` (the stage's own perspective is one level above
  the cards) and full-bleed via `.work.is-deck .work-wrap { max-width:none }`.
- **All cards open case studies now — the video lightbox is gone from JS**
  (markup + CSS left in place, inert `display:none`). Every card is
  interactive: `.card-cta` "View case study →" (aria-hidden) + a real
  `.card-hit` <button> labelled `"<title> — view case study"`.
- **Case study data lives in `data/projects.js`** (`caseStudy` blocks — same
  for all 3 projects). `main.js` `caseHtml()` renders the Carex structure:
  hero (kicker, title, lead, role/timeline/tools facts, metrics band) then 8
  numbered `.cs-sec` blocks 01 Overview, 02 Challenges, 03 Features,
  04 Process, 05 User Persona, 06 Eisenhower Matrix, 07 Sketches, 08 Final
  Screens, plus optional `View live site ↗` link (Fitplay has `href`) and a
  close button in `.cs-foot`. Sketches/screens `code`s map to hand-drawn
  inline SVGs in `CS_ART` (`flow, hero, mobile, board, screen-*`); screens may
  also carry an `img`.
- **Overlay**: `#caseStudy` (fixed, `hidden` initially) → `.casestudy-panel`
  with `.casestudy-top` (`#csKicker` + `#csClose`) and scrollable
  `#caseStudyBody`. Open = remove hidden + (double rAF) add `.open`; Close =
  remove `.open`, body overflow restored, focus returned to trigger;
  Esc closes, backdrop click closes, Tab is trapped inside while open.
- **index.html**: baked the 3 cards with `.card-cta`/`.card-hit` and added the
  `#caseStudy` overlay markup. Parity rule still enforced: baked card markup
  textContent == JS-rendered (seo-verify asserts it).
- **Stamps now**: `css/style.css?v=9`, `js/config.js?v=5`, `data/projects.js?v=3`,
  `js/aurora.js?v=2`, `js/main.js?v=5`. Bump any stamp whose file changes.
- **Verified**: `node --check` clean; `seo-verify.mjs` 10/10 + full JS/no-JS
  parity (workCards 3 both sides); `seo-geom.mjs` GEOM OK (3 cards >=300px,
  .work section 4311px tall, no zero-height/empty); `test-deck.mjs` — deck
  scaffold present, 3 card-hit buttons, Ludo card centres at expected scroll
  (op 1, zIndex 100), case study opens with all 8 sections + metrics + 6 art
  figures + live-site link, Esc closes and restores body scroll. NOTE: that
  deck-mid scroll target is `stackAbsTop + p*travel` (add, not subtract).
- Temp check scripts updated: `seo-verify.mjs` asserts workCards === 3 and
  `seo-geom.mjs` expects 3 cards (both in %TEMP%\opencode).

**Still open:** hero video blue re-encode (above); the pending portrait photo
swap for `assets/photos/portrait.jpg`; everything on the owner-account list.