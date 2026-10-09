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
  email: "bhanupartap1790@gmail.com",
  phone: "+91 87085 51762", // EDIT — shown in the contact section and footer
  whatsapp: "918708551762", // EDIT — digits only, with country code, for wa.me links
  availability: "Open to work & internships",

  /* --- the one-line pitch shown under the nav and in the footer -------- */
  tagline: "Digital Marketing · Web · AI", // EDIT

  /* --- hero headline. Keep the <em> for the accent-coloured serif word.
         The sr-only span puts the full name into the <h1> for search engines
         and screen readers without changing the visual design. */
  heroLines: [
    '<span class="sr-only">Priyanshu Rana — </span>I use AI to',
    "market <em>anything</em>",
    "I put my hand to.",
  ],

  /* --- short paragraph under the hero buttons -------------------------- */
  heroSub:
    "Priyanshu Rana — first-year college student, self-taught digital marketer and web developer from Siwan, Kaithal, Haryana. Open to work and internships.", // EDIT

  /* --- about section ---------------------------------------------------- */
  aboutLead: "I learn fast, ship faster.", // EDIT

  aboutBody: [
    // EDIT — keep these factual and current; replace as you grow.
    "I'm Priyanshu Rana, a first-year college student and self-taught digital marketer from Siwan, Kaithal, Haryana. I passed my 10th and 12th from CBSE, and since then I have been teaching myself digital marketing with AI — using it for research, content, ad copy and campaign planning instead of treating it as a buzzword.",
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

  /* --- what I'm doing right now ----------------------------------------- */
  now: [
    {
      title: "College, first year",
      body: "Studying in Kaithal. Classes fix my morning; the rest of the day belongs to marketing and building.",
    },
    {
      title: "Four months into digital marketing",
      body: "Teaching myself SEO, Meta and Google Ads, and content. AI does the research and first-draft work; the thinking stays mine.",
    },
    {
      title: "Shipping real sites",
      body: "The Fitplay Gym site is live. A full marketing site for a school is next. Nothing is a tutorial exercise any more.",
    },
    {
      title: "Looking for work",
      body: "An internship, or freelance work with a business near home. Local brands are my first choice — same language, same market, faster feedback.",
    },
  ],

  /* --- learning journey ------------------------------------------------- */
  journey: [
    {
      when: "Right now",
      title: "Open to internships and freelance work",
      body: "First-year student in Kaithal, four months of self-taught marketing, one site already live. Looking for somewhere to learn from people who do this every day.",
    },
    {
      when: "Month 1",
      title: "Foundations",
      body: "HTML, CSS and enough JavaScript to make a page do something. Then learning what SEO actually means — what a search intent is, and why a keyword is not the same thing as a topic.",
    },
    {
      when: "Month 2",
      title: "SEO and content that ranks",
      body: "Keyword research, on-page fixes and content calendars. Learning to write a page that answers a real question instead of stuffing the same phrase into it six times.",
    },
    {
      when: "Month 3",
      title: "Paid ads and AI workflows",
      body: "Meta and Google Ads setup, audiences and ad copy. Then wiring AI into research, drafts and campaign planning so the boring half of the work takes minutes instead of hours.",
    },
    {
      when: "Month 4",
      title: "First real work",
      body: "Building and shipping the Fitplay Gym marketing site — home page, memberships, training programs, enquiry form. More useful than every tutorial combined.",
    },
    {
      when: "Next",
      title: "What comes next",
      body: "A documented case study from a live site, SEO reporting that shows movement instead of impressions, and my first paid campaign run end to end.",
    },
  ],

  /* --- frequently asked questions --------------------------------------- */
  faq: [
    {
      q: "What services do you offer?",
      a: "AI-led digital marketing (research, ad copy, campaign planning), SEO and content, paid social ads, web design, front-end development, and analytics. If it involves getting a business found online, I can help.",
    },
    {
      q: "How do you charge for projects?",
      a: "It depends on the scope. Small sites and one-off campaigns are flat-fee. Ongoing marketing work is monthly retainer. I'll always give you a clear quote before starting — no surprises.",
    },
    {
      q: "How long does a typical project take?",
      a: "A simple website takes 1–2 weeks. A full marketing site with multiple pages takes 3–4 weeks. Ongoing marketing work is continuous — first results from SEO usually show in 4–6 weeks.",
    },
    {
      q: "Do you work with local businesses?",
      a: "Yes — local brands are my first choice. Same language, same market, faster feedback. Whether you're in Siwan, Kaithal or anywhere in Haryana, I'd love to work with you.",
    },
    {
      q: "What tools do you use?",
      a: "ChatGPT and other AI tools for research and drafts, Google Analytics and Search Console for tracking, Meta Business Suite and Google Ads for paid campaigns, Canva for design, and HTML/CSS/JavaScript for building sites.",
    },
    {
      q: "Are you available for full-time work?",
      a: "I'm currently a first-year college student, so I'm looking for internships and freelance projects. If you have a role that works around college hours, let's talk.",
    },
    {
      q: "Who is Priyanshu Rana?",
      a: "Priyanshu Rana is a first-year college student from Siwan, Kaithal, Haryana who teaches himself digital marketing with AI — SEO, Meta and Google Ads, content and ad copy — and builds websites and small games. Open to internships and freelance projects.",
    },
    {
      q: "Where is Priyanshu Rana from?",
      a: "Priyanshu Rana is from Siwan, a village in the Kaithal district of Haryana, India. He works with local businesses across Kaithal and Haryana, and with clients anywhere online.",
    },
    {
      q: "Is Priyanshu Rana also known as Priyanshu Siwan or Priyanshu Kaithal?",
      a: "Yes. Priyanshu Rana is often searched as \"Priyanshu Siwan\" or \"Priyanshu Kaithal\" because he is from Siwan, a village in the Kaithal district of Haryana, India. All three names mean the same person — a self-taught digital marketer and web developer.",
    },
  ],

  /* --- social links ----------------------------------------------------- */
  /* Set href to "#" for anything you don't have yet — it stays visible but
     won't link anywhere, so you can fill these in as you create accounts.
     Real profile URLs also go into the Person JSON-LD "sameAs" list in
     index.html — search engines use those to tie the profiles to your name. */
  socials: [
    { label: "Instagram", href: "https://www.instagram.com/bhanu.rana___/" },
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
