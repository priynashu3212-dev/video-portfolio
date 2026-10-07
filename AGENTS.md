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
- Placeholder email you@example.com remains until real address provided
- Git repository initialized; work is staged but **not committed**

## Next actions

1. Replace CONFIG.email in js/config.js with real address when available.
2. Add real social links in CONFIG.socials (or leave # until ready).
3. Set href in data/projects.js for Ludo when published.
4. Drop assets/Priyanshu-Rana-CV.pdf when available (auto-detect).
5. Update domain in robots.txt, sitemap.xml, canonical/og:url when known.

## Quick checks

- node --check js/*.js data/*.js
- node server.js from repo root, http://localhost:5173/
- Hero/backdrop contrast + motion: `node %TEMP%\opencode\measure-hero2.mjs`
- Video fallback: `node %TEMP%\opencode\check-aurora-fallback.mjs`
- Re-encoding the hero: edit `loopframe.html`, `node render-loop.mjs`, then the
  ffmpeg calls above. Grade single frames first with `node probe-frames.mjs 0.0 0.5`
  (a full render is ~4 minutes).