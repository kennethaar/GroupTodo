/* ============================================================
   115_RENDER dispatcher
   ============================================================ */
const VIEWS = {
  today: viewToday, next: viewNext, waiting: viewWaiting, chat: viewChat,
  projects: viewProjects, people: viewPeople, orgs: viewOrgs, contexts: viewContexts,
  pages: viewPages, page: viewPage, me: viewMe, review: viewReview, search: viewSearch,
  horizons: viewHorizons, checklists: viewChecklists, trackers: viewTrackers, help: viewHelp,
  plan: viewPlan, chores: viewChores,
};
const VIEW_TITLE = {
  today: "Journal", next: "Next", waiting: "Waiting for", chat: "Chat", projects: "Projects",
  people: "People", orgs: "Organisations", contexts: "Contexts", pages: "Pages", me: "Your page",
  review: "Weekly review", search: "Search", horizons: "Horizons", checklists: "Settings",
  trackers: "Trackers", help: "Help", plan: "Natural planning", chores: "Chores",
};

/* Held while a batch of changes runs, each of which would otherwise redraw the
   whole screen on its way past. The redraw happens once, at the end. */
let RENDER_HOLD = 0;
let RENDER_MISSED = false;
