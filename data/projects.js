/* ==========================================================================
   YOUR PROJECTS — this file controls the Work section (the 3D scroll deck).

   Every project needs:
     title      the project name
     category   keeps the old filtering classification
     poster     cover image shown on the card
     summary    one line on what the project actually is

   Recommended:
     stack      the tools used, as a short comma-separated string
     href       a public link to the finished thing (shown inside the case
                study, not on the card — the card opens the case study)

   caseStudy   the full write-up shown when the card is clicked. It follows
                the Carex UX case-study structure: Overview, Challenges,
                Features, Process (Discover/Define/Ideate/Design), User
                Persona, Eisenhower Matrix, Sketches, Final Screens.
                Every field is optional, so a short project can ship a short
                case study. `sketches`/`screens` entries carry a `code` that
                js/main.js turns into a matching illustration:
                flow, hero, mobile, board, screen-hero, screen-work,
                screen-contact, screen-play.

   RULE: never invent a metric. "Ships in 2 weeks" is honest and still
   impressive. A made-up "+240% traffic" is a lie that ends the conversation.
   ========================================================================== */

const PROJECTS = [
  {
    title: "Fitplay Gym, Kaithal — Website",
    category: "Website",
    client: "Fitplay Gym",
    year: "2026",
    poster: "assets/posters/fitplay/hero.jpg",
    summary: "Full marketing site for a local gym: landing page, memberships, training programs and about.",
    stack: "HTML, CSS, JavaScript · Vercel",
    href: "https://fitplay-gym.vercel.app/",
    caseStudy: {
      lead: "A full marketing website that turns a first find on Google into a walk-in at a local gym.",
      role: "Design, build, deploy — solo",
      timeline: "2026 · 2–3 weeks",
      tools: ["HTML", "CSS", "JavaScript", "Vercel"],
      metrics: [
        { n: "Live", l: "hosted on Vercel" },
        { n: "1", l: "first business site shipped" },
        { n: "4", l: "pages: home, memberships, programs, about" },
        { n: "0", l: "spent on templates or builders" },
      ],
      overview: [
        "Fitplay is a gym in Kaithal with no usable web presence. The goal was simple: when someone searches for a gym in Kaithal, Fitplay should look real, modern and worth visiting.",
        "I planned the pages, wrote the copy, built the responsive layout and deployed it to a clean URL. No page-builder, no template — the site is hand-coded HTML, CSS and JavaScript.",
      ],
      challenges: [
        { title: "Starting from nothing", body: "The gym had no brand assets, logo or photography ready, so the design had to stand on its own and leave easy swap-in slots for real photos later." },
        { title: "Local-first voice", body: "The copy had to feel local and credible — memberships in plain language, not marketing fluff — so a visitor from Kaithal trusts it in the first seconds." },
        { title: "Mobile traffic first", body: "Most local searches happen on a phone, so the layout had to read perfectly at 390px wide before it was ever opened on a laptop." },
      ],
      features: [
        { title: "Landing hero + enquiry path", body: "A clear first screen with the value proposition and a visible way to get in touch or join." },
        { title: "Memberships & pricing", body: "Program cards that explain what you get, without the fine-print wall that kills local conversions." },
        { title: "Training programs", body: "A section that shows what a trainer actually delivers and builds credibility for the price." },
        { title: "About + local trust", body: "Local story, location and framing that says gym-in-Kaithal, not generic fitness template." },
      ],
      process: {
        discover: { title: "Look first", body: "Audited how local gyms in Haryana present themselves online and what the owner actually had — a business, a space, and no site. Decided the first version would be one focused marketing website, not a booking app." },
        define: { title: "Four pages, one job", body: "Mapped home, memberships, programs and about — each with a single conversion goal: get to WhatsApp or walk in." },
        ideate: { title: "Clean, not loud", body: "Options ranged from dark and aggressive to clean and approachable. Members of a local gym want energetic but trustworthy, so the design landed clean-first with movement." },
        design: { title: "Mobile-first build", body: "Responsive editorial layout, program cards, a hero with momentum and a mobile-first build order so the phone experience was never an afterthought." },
      },
      personas: [
        {
          name: "Gym owner",
          role: "Business owner, Kaithal",
          quote: "I need a site that makes my gym look as good as it is, before someone walks in.",
          goals: ["Look professional online", "Get WhatsApp enquiries", "Outrank local competitors"],
          pains: ["No designer available locally", "Template sites look fake", "Wants to update content easily"],
        },
        {
          name: "Local member-to-be",
          role: "20–35, Kaithal",
          quote: "I'll judge the gym by its website in about ten seconds.",
          goals: ["See prices without calling", "Trust that the place is real", "Find phone and visit info fast"],
          pains: ["Slow, broken mobile pages", "Vague pricing", "No clear contact path"],
        },
      ],
      matrix: {
        do: ["Hero + first impression", "WhatsApp / contact path", "Publish the site live"],
        schedule: ["Full content copy", "About and local trust section", "Performance + SEO basics"],
        delegate: ["Stock photos (owner replaces later)", "Logo refinements", "Social posting calendar"],
        drop: ["Booking engine", "Online membership payments", "Multi-language first pass"],
      },
      sketches: [
        { code: "flow", title: "Page flow — hero → memberships → programs → about" },
        { code: "hero", title: "Hero composition" },
        { code: "mobile", title: "Mobile single-column stack" },
      ],
      screens: [
        { code: "screen-hero", title: "Desktop hero + nav" },
        { code: "screen-work", title: "Memberships / programs section" },
        { code: "screen-contact", title: "Contact + footer" },
      ],
    },
  },
  {
    title: "Ludo — Mobile Game",
    category: "Game",
    client: "Self-initiated",
    year: "2026",
    poster: "assets/posters/ph-game.svg",
    summary: "Self-initiated Ludo build to practise game logic, turn handling and state management.",
    stack: "JavaScript · game logic",
    caseStudy: {
      lead: "A Ludo board built from scratch to learn state management, turn logic and game feel.",
      role: "Design & code — solo",
      timeline: "2026 · evenings",
      tools: ["JavaScript", "Canvas"],
      metrics: [
        { n: "Self", l: "initiated learning build" },
        { n: "Plain", l: "JavaScript, no game engine" },
        { n: "Turns", l: "dice · tokens · finish" },
        { n: "Soon", l: "Play Store URL" },
      ],
      overview: [
        "A Ludo board I'm building from scratch to practise thinking in state. No game library for the logic — that is the point. Turns, dice, token movement and winning all run on explicitly written rules.",
        "It is not shipped yet; the value is the engineering. The Play Store or demo link goes up the moment it is published.",
      ],
      challenges: [
        { title: "One source of truth", body: "Whose turn, after which roll, what a six means — the whole board has to live in a single state object, or rules drift apart." },
        { title: "Rules edge cases", body: "Stars, safety squares and exact landing to finish are small rules that multiply into a dense decision tree fast." },
        { title: "Game feel", body: "A dice roll has to feel random but fair, and tokens have to move without piling into each other on the same square." },
      ],
      features: [
        { title: "Hand-rolled dice + turns", body: "The core loop — written from scratch, no engine." },
        { title: "Token movement", body: "Steps, captures and safe squares as explicit, testable rules." },
        { title: "Status panel", body: "Whose turn, last roll and who is winning, readable at a glance." },
      ],
      process: {
        discover: { title: "Played the real thing", body: "Logged the rules and every moment that feels unfair or buggy in existing Ludo apps, so the build fixes the painful parts first." },
        define: { title: "Minimum engine", body: "Scoped ruthlessly: two players, one board, dice and finish — nothing else until that core works." },
        ideate: { title: "Canvas or DOM", body: "Board drawing on canvas, status UI in the DOM; the split keeps rendering dumb and state readable." },
        design: { title: "State model first", body: "Every action is a pure function that returns new state; the UI only reads state. Testing the rules becomes trivial." },
      },
      personas: [
        {
          name: "Casual player",
          role: "Student, 15–25",
          quote: "I want to kill five minutes and maybe win.",
          goals: ["Picks up in ten seconds", "Turns move fast", "No confusing bugs"],
          pains: ["Long animations", "Bots that feel rigged", "Rule screens nobody reads"],
        },
      ],
      matrix: {
        do: ["Core turn loop", "Dice + movement rules", "Two-player finish condition"],
        schedule: ["Animations + game feel", "Status panel", "Rules documentation"],
        delegate: ["Board art", "Sound effects", "Store listing copy"],
        drop: ["Online multiplayer", "Bots for now", "Paid features"],
      },
      sketches: [
        { code: "board", title: "Board layout sketch" },
        { code: "flow", title: "Turn flow diagram" },
        { code: "mobile", title: "Mobile play screen" },
      ],
      screens: [
        { code: "screen-play", title: "In-progress play screen" },
        { code: "screen-hero", title: "Menu / start screen" },
        { code: "screen-contact", title: "Status and controls" },
      ],
    },
  },
  {
    title: "This Portfolio — Personal Website",
    category: "Website",
    client: "Self-initiated",
    year: "2026",
    poster: "assets/hero-poster.jpg?v=3",
    summary: "The site you are on — video hero, blue editorial theme and SEO architecture built by hand.",
    stack: "HTML, CSS, JS, WebGL · Vercel",
    caseStudy: {
      lead: "A portfolio that has to rank for its own name, hold attention in the first second, and prove four months of self-taught work.",
      role: "Design, build, SEO, deploy — solo",
      timeline: "Oct 2026 · ongoing",
      tools: ["HTML", "CSS", "JavaScript", "WebGL", "FFmpeg", "Vercel"],
      metrics: [
        { n: "1", l: "page — the whole site" },
        { n: "96", l: "frames in the seamless hero loop" },
        { n: "0", l: "stock footage used" },
        { n: "0.98", l: "SSIM loop-seam score (1.0 = perfect)" },
      ],
      overview: [
        "A one-page portfolio that has to earn the click in the first second, prove real work, and get found when someone searches a name that has barely existed online.",
        "Built for Priyanshu Rana (Siwan, Kaithal). The hero is a 96-frame procedurally generated WebGL aurora loop instead of borrowed footage, every section is data-driven but baked into the raw HTML for crawlers, and the search architecture is handled properly — canonical, sitemap, robots.txt, ProfilePage and FAQPage schema. This card is the case study.",
      ],
      challenges: [
        { title: "A first impression you can't license", body: "Portfolios usually open with stock footage. I generated a seamless procedural aurora loop in WebGL and graded it frame-by-frame (loop seam verified at 0.98 SSIM)." },
        { title: "Bots read the raw file", body: "A JS-rendered page can show search engines an empty grid and a generic title. Every section is baked into index.html and the JSON-LD schema is written by hand." },
        { title: "Name authority from zero", body: "'Priyanshu Rana' had no real presence anywhere. Built a dedicated name page, aligned entity schema across the site, and landed the first real backlink (the Fitplay footer credit)." },
        { title: "Changes that hid themselves", body: "Stale cache headers kept a re-encoded hero invisible for up to an hour. Fixed with no-store headers plus ?v= cache-busting, and verified by comparing served bytes against disk." },
      ],
      features: [
        { title: "Video hero with three fallbacks", body: "VP9/MP4 loop, a live WebGL shader that paints instantly, and a poster under reduced-motion — the hero never sits still, even offline." },
        { title: "Data-driven, no-JS parity", body: "Content lives in one config file and is baked identically into HTML, so crawlers and JS-rendered visitors see exactly the same page." },
        { title: "SEO architecture", body: "Canonical, sitemap, robots.txt, ProfilePage + FAQPage schema, a /priyanshu-rana.html name page and 27 name mentions in the raw source." },
        { title: "This 3D scroll deck", body: "The Work section you are scrolling: tilted slides that straighten in the centre of the screen, parallax depth layers, and a case study that opens on click." },
      ],
      process: {
        discover: { title: "Search the goal, not the style", body: "Watched the target name searches, audited competitor portfolios and defined success as rank #1 for the name plus a page that converts curiosity into enquiries." },
        define: { title: "One page, honest scope", body: "Sections 01–09, a content model of config/data arrays, baked HTML for no-JS, and explicit requirements for reduced-motion, keyboard and screen-reader use." },
        ideate: { title: "Bright, airy, digital", body: "Compared dark SaaS, warm editorial and clean blue. Chose white-and-light-blue with a bright blue accent and Poppins type — digital but calm, readable at every size." },
        design: { title: "Tokens before pixels", body: "Palette system first, then the WebGL hero palette, then the card system with tilt and stagger, then the motion language — scroll deck, hover lifts, case study transitions." },
      },
      personas: [
        {
          name: "Local business owner",
          role: "Kaithal area, 30–45",
          quote: "I came looking for someone who can build AND market my site.",
          goals: ["See real local work", "A clear contact path", "Proof that things actually shipped"],
          pains: ["Portfolios full of fake numbers", "Agencies that overcharge", "No real projects to trust"],
        },
        {
          name: "Hiring manager",
          role: "Remote, scans fast",
          quote: "If I can't tell what you did in 30 seconds, I move on.",
          goals: ["Judge craft quickly", "Working links + CV", "Honest outcomes"],
          pains: ["Broken links", "Vague role descriptions", "Lightboxes that fight the scroll"],
        },
      ],
      matrix: {
        do: ["Hero that wins the first second", "Contact path that works", "Publish Fitplay as real proof", "This scroll-deck with case studies"],
        schedule: ["On-page SEO + schema", "Backlinks and real profiles", "Higher-resolution drone photo"],
        delegate: ["Favicon + meta polish", "Re-encode hero video", "Sitemap updates"],
        drop: ["Testimonials with no real quotes", "Multiple template pages", "Fabricated traffic numbers"],
      },
      sketches: [
        { code: "flow", title: "Section flow — hero → about → work → contact" },
        { code: "hero", title: "Hero composition (video + portrait)" },
        { code: "mobile", title: "Mobile single-column layout" },
      ],
      screens: [
        { code: "screen-hero", title: "Final hero — procedural aurora + portrait", img: "assets/hero-poster.jpg?v=3" },
        { code: "screen-work", title: "Final work — the 3D slide deck" },
        { code: "screen-contact", title: "Final contact — details grid + form" },
      ],
    },
  },
];