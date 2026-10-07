# Priyanshu Rana — Portfolio

A single-page portfolio for a digital marketer and web developer. Static
HTML, CSS and JavaScript. No build step, no framework, no dependencies — it
is served straight from disk and deployed straight to any static host.

## Run it locally

```bash
node server.js
```

Then open <http://localhost:5173/>. Edit any file and refresh; there is no
compile step.

## Where to change things

Almost everything is driven by two data files, so you rarely need to touch
the markup or the styles.

| What | File |
| --- | --- |
| Name, role, email, links, stats, services, process, testimonials | `js/config.js` |
| Projects and case studies | `data/projects.js` |
| Colours and all styling | `css/style.css` (the `:root` block at the top) |
| Page content and section order | `index.html` |

### The one thing still to fill in

`js/config.js` → `email` is still `you@example.com`. It is shown in the
footer, on the About button, and is where the contact form sends enquiries.
Nothing works until that is your real address.

## The hero background

`js/aurora.js` draws an animated flow-noise field on a WebGL fragment
shader. It reads `--accent`, `--accent-2` and `--bg` from `css/style.css`, so
changing those three values retints the animation along with the rest of the
site.

It degrades in three steps: WebGL shader, then a 2D canvas with drifting
gradients, then the static CSS gradient on `.aurora`. It caps at 30fps,
renders at reduced resolution, pauses when the tab is hidden or the hero
scrolls out of view, and renders a single still frame under
`prefers-reduced-motion`.

## Contact form

The form posts to Netlify Forms, which needs no backend and no paid service.
That only works once the site is on Netlify; anywhere else it falls back to
opening the visitor's email client. There is a honeypot field for spam.

## Before you deploy

1. Set `email` in `js/config.js`.
2. Replace `https://yourdomain.com` in `sitemap.xml` and `robots.txt`.
3. Add a `<link rel="canonical">` and `og:url` in `index.html`.
4. Add your own social links to `CONFIG.socials`, and drop a PDF at
   `assets/Priyanshu-Rana-CV.pdf`. The Download CV button hides itself
   automatically if the file is missing.
5. Add real quotes to `CONFIG.testimonials` if you have any. The section stays
   hidden until you do, because invented testimonials do more harm than none.
6. Regenerate `assets/og-cover.png` if you change the name or headline, since
   it is what link previews show.

## Deploying

Any static host works. On Netlify, drag the folder onto the deploy screen —
the form starts working with no further setup. On Vercel, `vercel deploy`.
On GitHub Pages, push to a repository and enable Pages.
