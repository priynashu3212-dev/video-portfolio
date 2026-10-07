/* ==========================================================================
   YOUR PROJECTS — this file controls the Work section.

   Every project needs:
     title      the project name
     category   must match a filter chip (Website / Game / Campaign / Content)
     poster     image shown on the card
     href       a public link to the finished thing

   Strongly recommended, because they are what separates a portfolio from
   a list of links:
     summary    one line on what the project actually is
     result     the outcome, with a number in it if you have one
                (e.g. "Cut cost per lead 40%", "Page 1 for 18 keywords")
     stack      the tools used, as a short comma-separated string

   Optional:
     src        path to an .mp4 in assets/videos/ if you want it to open in
                the built-in player instead of a new tab. A short screen
                recording of the site working is a strong addition.

   A project with neither href nor src is rendered as a static card with no
   pointer and no arrow, so the grid still looks intentional. Use that only
   while a link is genuinely on its way.

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
    result: "Live and taking enquiries from the Kaithal area.",
    stack: "HTML, CSS, JavaScript",
    href: "https://fitplay-gym.vercel.app/",
  },
  {
    title: "Ludo — Mobile Game",
    category: "Game",
    client: "Self-initiated",
    year: "2026",
    poster: "assets/posters/ph-game.svg",
    summary: "Self-initiated Ludo build to practise game logic, turn handling and state management.",
    // EDIT: paste the Play Store / live demo URL here once it is published.
    // Until then this card stays static rather than pretending to link.
    href: "",
  },
];
