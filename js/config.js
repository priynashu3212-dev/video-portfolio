/* ==========================================================================
   SITE SETTINGS — this is the only file you need to edit for your details.
   Replace anything marked "EDIT" with your own. Everything else on the
   site reads from here, so you never have to hunt through the code.
   ========================================================================== */

const CONFIG = {
  /* --- who you are ------------------------------------------------------ */
  name: "Priyanshu Rana",
  role: "Digital Marketing with AI · Web Developer",
  city: "Siwan, Kaithal",
  // !! CHANGE THIS !! This is the only real placeholder left on the site.
  // It is shown in the footer, on the About button, and is the address the
  // contact form sends to. Until you replace it, enquiries go nowhere.
  email: "you@example.com",
  availability: "Open to work & internships",

  /* --- the one-line pitch shown under the nav and in the footer -------- */
  tagline: "Digital Marketing · Web · AI", // EDIT

  /* --- hero headline. Keep the <em> for the accent-coloured serif word. */
  heroLines: [
    "I use AI to",
    "market <em>anything</em>",
    "I put my hand to.",
  ],

  /* --- short paragraph under the hero buttons -------------------------- */
  heroSub:
    "Four months into digital marketing with AI, building websites and games along the way. First-year college student based in Siwan, Kaithal.", // EDIT

  /* --- about section ---------------------------------------------------- */
  aboutLead: "I learn fast, ship faster.", // EDIT

  aboutBody: [
    // EDIT — keep these factual and current; replace as you grow.
    "I passed my 10th and 12th from CBSE and am now in my first year of college. Since then I have been teaching myself digital marketing with AI — using it for research, content, ad copy and campaign planning instead of treating it as a buzzword.",
    "Alongside that I build websites and small games, because I like seeing an idea through from the first wireframe to something you can actually click. I am looking for work, internships or freelance projects.",
  ],

  /* --- what you work with (numbered list) ------------------------------ */
  skills: [
    "AI for marketing", // EDIT — add, remove, reorder
    "Prompt engineering",
    "SEO",
    "Meta & Google Ads",
    "Content creation",
    "Canva",
    "Web design",
    "HTML, CSS & JavaScript",
    "WordPress",
    "Analytics & reporting",
  ],

  /* --- stat band under the hero. `value` animates up on an odometer when it
        scrolls in, so keep it a number. `suffix` is optional and sits after
        the count.

        Only claims that are true and checkable go here. Every number below is
        either something stated elsewhere on this page or a count you can read
        off the page itself. Do not add a figure you cannot defend when
        someone asks — "2 projects" is fine, a made-up "+240% traffic" ends
        the conversation. */
  stats: [
    { value: 4, suffix: "mo", label: "In digital marketing" },
    { value: 10, suffix: "+", label: "Tools in the stack" },
    { value: 100, suffix: "%", label: "Self-taught" },
  ],

  /* --- services grid. `n` is the eyebrow number, `title` the heading. ---- */
  services: [
    { title: "AI-led marketing", body: "Research, ad copy and campaign planning run through AI workflows instead of guesswork." },
    { title: "SEO & content", body: "On-page fixes, keyword research and content calendars built to actually rank." },
    { title: "Paid social", body: "Meta and Google Ads set up, tested and reported on with numbers that mean something." },
    { title: "Web design", body: "Responsive, fast sites that look right on a phone before anyone opens a laptop." },
    { title: "Front-end build", body: "Clean HTML, CSS and JavaScript — including the animation and interaction work." },
    { title: "Analytics", body: "Tracking that answers the only question that matters: what do I do next?" },
  ],

  /* --- how you work, as a numbered timeline ----------------------------- */
  process: [
    { title: "Discovery call", body: "We talk about the goal, the audience and what success actually looks like." },
    { title: "Research & plan", body: "I dig into competitors and data, then write the plan I'd want to be held to." },
    { title: "Build & ship", body: "Work goes out in stages so you see progress early, not at the end." },
    { title: "Measure & improve", body: "We look at the numbers together and decide what to change next." },
  ],

  /* --- social links ----------------------------------------------------- */
  /* Set href to "#" for anything you don't have yet — it stays visible but
     won't link anywhere, so you can fill these in as you create accounts. */
  socials: [
    { label: "Instagram", href: "#" }, // EDIT
    { label: "LinkedIn", href: "#" }, // EDIT
    { label: "YouTube", href: "#" }, // EDIT
    { label: "X", href: "#" }, // EDIT
  ],

  /* --- testimonials ----------------------------------------------------- */
  /* The "What clients say" section is HIDDEN unless this array has real
     entries in it. Invented quotes are worse than no quotes at all, so
     there is nothing to fill in here by default.

     When someone genuinely says something nice about your work, add it:
       testimonials: [{ quote: "…", name: "…", role: "…" }]

     Only use quotes from people who really said them, and only if they are
     happy to be named. */
  testimonials: [],
};
