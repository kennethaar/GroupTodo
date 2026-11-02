/* ============================================================
   71_HORIZONS_OF_FOCUS
   David Allen's six altitudes. Control (what's on your plate) is only half
   the model; perspective is the other half, and it is the half every todo
   app drops. Nothing here is invented for you -- the app ships with no
   areas, no goals and no contexts, because borrowed ones are worse than none.

     Horizon 5  50,000 ft   Purpose and principles   why you are here
     Horizon 4  40,000 ft   Vision                   3-5 years out
     Horizon 3  30,000 ft   Goals and objectives     1-2 years
     Horizon 2  20,000 ft   Areas of focus           ongoing, never "done"
     Horizon 1  10,000 ft   Projects                 outcomes inside a year
     Ground      runway     Next actions             the very next physical move
   ============================================================ */
/* Underscore-prefixed so it sorts to the top of pages/ next to the other
   system pages, rather than mixing in with real content. */
/* Each horizon is its own page under pages/_/ -- pages/_/Purpose.md,
   pages/_/Vision.md -- so they read and link like anything else: [[_/Purpose]].

   pages/_/ is horizons and nothing else. Cancelled projects used to share it,
   which is why a horizon page is still marked type:: horizon and why the
   project listings still filter horizons out -- a belt as well as braces for a
   vault that was written before cancelled moved to pages/-/. */
const DIR_HORIZONS    = join(PAGES, "_");
const HORIZONS_LEGACY = [join(PAGES, "_horizon.md"), join(PAGES, "Horizons.md")];

/* Each row carries the wording for a space that is somebody's whole life, and
   `by` holds what changes when the space is something narrower. Only wording
   changes: key, page, level and alt are the same in every profile, so the files
   on disk are identical whatever a space is for and switching profile never
   moves or rewrites anything. */
const HORIZONS = [
  {key: "purpose", h: "Horizon 5", alt: "50,000 ft", name: "Purpose & principles",
   page: "Purpose", level: "5",
   ask: "Why does this life or this work exist? What standards do you hold yourself to?",
   wiz: {label: "Why are you doing any of this, and what will you not trade away?",
         help: "Purpose is the why. Principles are the standards that hold even when it costs you.",
         placeholder: "I am here to...\nI will not..."},
   by: {work: {
     name: "Mission & mandate", inherited: true,
     ask: "What does this organisation exist to do, and what are you accountable for inside it?",
     wiz: {label: "What is the organisation for, and what is your part in it?",
           help: "You are not inventing this one - you are writing down what already exists, " +
                 "so the work below it has something to answer to. The mission in your own " +
                 "words, then the handful of things you are actually accountable for.",
           placeholder: "We exist to...\nI am accountable for..."}}}},
  {key: "vision",  h: "Horizon 4", alt: "40,000 ft", name: "Vision",
   page: "Vision", level: "4",
   ask: "Three to five years out, what does wild success look like?",
   wiz: {label: "Three to five years out, what does wild success look like?",
         help: "Prose is fine. Write it in the present tense, as though you are already there.",
         placeholder: "The work funds the life, not the other way round..."},
   by: {work: {
     name: "Strategy", inherited: true,
     ask: "Where is the team or the company headed over the next three years?",
     wiz: {label: "Where is the team or the company headed over the next three years?",
           help: "Their direction, not yours - the strategy your goals have to serve. " +
                 "Whatever you can say plainly is enough.",
           placeholder: "The team is moving towards..."}}}},
  {key: "goals",   h: "Horizon 3", alt: "30,000 ft", name: "Goals & objectives",
   ask: "What do you want to be true in the next one to two years?",
   wiz: {label: "What do you want to be true in one to two years?",
         help: "Concrete enough to know when you got there. One per line. You can hang each " +
               "one under a responsibility afterwards.",
         placeholder: "Debt cleared\nShipped the new product\nRunning a half marathon"},
   by: {work: {
     ask: "What has to be true in the next year or two for your part of this to be working?",
     wiz: {label: "What has to be true in the next year or two?",
           help: "The outcomes you are on the hook for, in your words rather than the " +
                 "performance-review ones. One per line.",
           placeholder: "Shipped the new product\nHiring no longer the bottleneck\nOn-call is quiet"}}}},
  {key: "areas",   h: "Horizon 2", alt: "20,000 ft", name: "Areas & responsibilities",
   ask: "Which parts of this area must stay healthy? These never finish.",
   wiz: {label: "Which responsibilities in this area must stay healthy?",
         help: "These never get finished - you just keep them in good shape. Most areas " +
               "hold somewhere between three and ten. One per line, in your own words.",
         placeholder: "Health\nFinances\nTeam\nHome"},
   by: {work: {
     name: "Areas & accountabilities",
     ask: "Which parts of the job must stay healthy? These never finish.",
     wiz: {label: "Which parts of the job must stay healthy?",
           help: "This is the job description in your own words: the handful of things that " +
                 "are never done, only kept in good shape. One per line.",
           placeholder: "Team\nClients\nHiring\nBudget"},
     chips: "work"}}},
  {key: "projects",h: "Horizon 1", alt: "10,000 ft", name: "Projects",
   ask: "What outcomes are you committed to finishing within a year?"},
  {key: "ground",  h: "Ground",    alt: "runway",    name: "Next actions",
   ask: "What is the very next physical, visible move?"},
];
const HORIZON_BY_KEY = Object.fromEntries(HORIZONS.map(h => [h.key, h]));

/* ---------- what a space is for ----------
   Spaces were always separate vaults with separate horizons, but the ladder
   itself was the same six questions everywhere, so a Work space got asked why
   it is here and what it will not trade away. Those are questions about a life,
   not about a job: at work the top two altitudes exist but you inherit them --
   the organisation's mission and its strategy -- and what is yours is the
   mandate inside them. A space declares what it is for, and that decides which
   altitudes it runs and how they are worded.

   Nothing is ever deleted by a profile. An altitude a profile leaves out simply
   stops being shown and stops being nudged about; the page stays on disk, and
   switching back shows it again untouched. */
const HORIZON_KEYS = HORIZONS.map(h => h.key);

const HORIZON_PROFILES = {
  life: {
    key: "life", label: "Life",
    blurb: "All six altitudes, purpose and vision included.",
    active: HORIZON_KEYS,
    chips: "life",
  },
  work: {
    key: "work", label: "Job",
    blurb: "All six. The top two are the organisation's mission and strategy, never nagged about.",
    active: HORIZON_KEYS,
    chips: "work",
  },
  project: {
    key: "project", label: "Project",
    blurb: "Goals down to next actions. No purpose or vision.",
    active: HORIZON_KEYS.filter(k => k !== "purpose" && k !== "vision"),
    chips: "life",
  },
};
const DEFAULT_HORIZON_PROFILE = "life";
