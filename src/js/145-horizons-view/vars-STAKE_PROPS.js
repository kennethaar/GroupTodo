/* ============================================================
   STAKEHOLDERS -- who wants to hear how a responsibility is going
   stakeholder:: on a responsibility's page (stakeholders:: is read too), with
   people and organisations: a boss who follows Finance, a board. They are
   stakeholders of every project filed under it, without working on any of
   them: not in with::, not on Planner cards, not a client of the projects.
   When each was last told is kept beside them, told:: [[p/Kari]] <stamp>, and
   how often they want to hear is on their own page, update_every:: 1 month.
   ============================================================ */
const STAKE_PROPS = ["stakeholder", "stakeholders"];
const TOLD_PROP = "told";
// What org:: on a responsibility means, without its stakeholders or when they were told.
const areaClientProps = props => Object.fromEntries(Object.entries(props || {})
  .filter(([k]) => ![...STAKE_PROPS, TOLD_PROP].includes(k.toLowerCase())));
const stakeRef = to => (to.org ? "o/" : "p/") + to.name;
const sameStake = (x, y) => !!x.org === !!y.org &&
  (x.org ? x.name.toLowerCase() === y.name.toLowerCase() : samePerson(x.name, y.name));
const areaPathOf = name => join(DIRS.areas, slugify(name) + ".md");
