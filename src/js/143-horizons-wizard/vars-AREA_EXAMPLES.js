/* ============================================================
   143_HORIZONS_WIZARD
   Runs on the first visit to Horizons. Climbs from the most concrete
   altitude to the most abstract, which is the order people can actually
   answer in -- Allen's own advice is to implement bottom-up even though
   you review top-down. Every step is skippable and nothing is written
   until the last one.

   Which steps there are, and what each one asks, come from the space's own
   profile -- a job is not asked what it will not trade away.
   ============================================================ */
const AREA_EXAMPLES = {
  life: ["Health", "Finances", "Family", "Home", "Career", "Team",
         "Clients", "Learning", "Friendships", "Admin"],
  work: ["Team", "Clients", "Hiring", "Budget", "Reporting", "Quality",
         "Roadmap", "On-call", "Vendors", "Admin"],
};
const areaChips = () => AREA_EXAMPLES[horizonProfile().chips] || AREA_EXAMPLES.life;

const WIZ = {step: 0, areas: "", goals: "", vision: "", purpose: ""};
