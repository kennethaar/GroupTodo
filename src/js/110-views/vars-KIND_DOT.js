/* ============================================================
   PAGES -- everything in the spaces on screen
   ============================================================ */
const KIND_DOT = {project: "--proj", person: "--zet", org: "--wait", context: "--ctx", area: "--accent",
  goal: "--accent", zettel: "--fg3", review: "--zet", checklist: "--done", journal: "--fg3", horizon: "--accent", page: "--fg3"};
const kindDot = kind => el("span", {class: "kdot", style: "background:var(" + (KIND_DOT[kind] || "--fg3") + ")"});
