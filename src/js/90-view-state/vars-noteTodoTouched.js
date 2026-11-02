const noteTodoTouched = () => { state.lastTodoTouch = Date.now(); };

/* ============================================================
   95_SHELL -- the sidebar, the top bar and what lives in them
   The sidebar is places, the top bar is the things you do from anywhere:
   capture, search, help, and which spaces are on screen. Nothing in either
   is about the screen you happen to be on.
   ============================================================ */

/* ---------- the views, and the readings each one has ----------
   A view opens at the reading last picked for it with its switch or a v key,
   and at its first before one has been. A link that goes to one reading
   (a review step, a mind map focus) does not change which. */
const SUBS = {
  next:     [["list", "List"], ["board", "Board"], ["calendar", "Calendar"]],
  waiting:  [["list", "List"], ["board", "Board"]],
  projects: [["list", "List"], ["board", "Board"], ["timeline", "Timeline"], ["report", "Report"], ["hours", "Hours"]],
  people:   [["list", "List"], ["cards", "Cards"], ["board", "Board"]],
  orgs:     [["list", "List"], ["board", "Board"]],
  pages:    [["list", "List"], ["board", "Board"], ["mindmap", "Mind map"], ["graph", "Graph"], ["tree", "Hierarchy"]],
  // In the order of the steps they are done in: clarify, then actions, then projects.
  review:   [["steps", "Steps"], ["days", "Clarify"], ["actions", "Actions"], ["projects", "Projects"], ["reflect", "Reflect"]],
};
const subOk = (view, sub) => !!(SUBS[view] || []).find(s => s[0] === sub);
const defaultSub = view => {
  if (!SUBS[view]) return null;
  const kept = PREF.get("sub." + view);
  return subOk(view, kept) ? kept : SUBS[view][0][0];
};
const pickSub = (view, sub) => { PREF.set("sub." + view, sub); go(view, {sub}); };
const subNow = () => subOk(state.view, state.sub) ? state.sub : defaultSub(state.view);

/* ---------- the sidebar ---------- */
/* One picture per kind of thing, the same in the sidebar and in the line menu.
   ︎ asks for the plain text glyph rather than the colour emoji. */
const ICON = {
  projects: "⚑",               // flag
  next:     "⚡︎",         // lightning bolt
  orgs:     "\u{1F3E2}︎",      // the tall office building
  people:   "\u{1F464}︎",      // bust
  pages:    "\u{1F4C4}︎",      // page
  horizons: "\u{1F52D}︎",      // telescope
};
const NAV_ITEMS = [
  {id: "today",    icon: "☀", label: "Journal"},
  {id: "next",     icon: ICON.next, label: "Next"},
  {id: "waiting",  icon: "⏳", label: "Waiting for"},
  // Talking to yourself is not a feature: Chat waits for somebody else to be
  // in one of your spaces, and stays once there are threads.
  {id: "chat",     icon: "○", label: "Chat", when: () => anySpaceShared() || allThreads().length > 0},
  "sep",
  {id: "projects", icon: ICON.projects, label: "Projects"},
  {id: "people",   icon: ICON.people, label: "People"},
  {id: "orgs",     icon: ICON.orgs, label: "Organisations"},
  {id: "contexts", icon: "@",      label: "Contexts"},
  // Once any task repeats: the home's chores, room by room.
  {id: "chores",   icon: "↻",      label: "Chores", when: () => allChores().length > 0},
  {id: "pages",    icon: ICON.pages, label: "Pages"},
  // Your areas are Horizon 2, so there is always something here to look at.
  {id: "horizons", icon: ICON.horizons, label: "Horizons", small: true},
  // The weekly review is a routine itself, so this is never empty.
  {id: "checklists", icon: "⚙︎", label: "Settings", small: true},
  // Only once a day page has a tracker line on it.
  {id: "trackers", icon: "↗", label: "Trackers", small: true, when: () => trackerList().length > 0},
  // The pages you pinned, from the ⋯ beside a page's title. See navPins().
  "pins",
  "grow",
  // Not a view: a countdown you start from the sidebar. See timerNavItem().
  {id: "timer",    icon: "◷", label: "Timer", small: true},
  {id: "review",   icon: "✓", label: "Weekly review"},
];

/* The counts are true totals across the spaces on screen. */
const myOpen = () => memo("myOpen", () => leafActions().filter(a => OPEN_STATES[a.state] && a.mine));
const dueNow = () => myOpen().filter(a => a.due && a.due <= todayISO());
/* What you are owed: anything handed to somebody else, and anything of yours
   that is waiting on somebody nobody named. Somebody else's own work is not
   something you are waiting for. */
const waitingRows = () => memo("waitingRows", () => leafActions().filter(a => OPEN_STATES[a.state] &&
  ((a.assignee && !samePerson(a.assignee, whoAmI())) || (a.state === "WAIT" && a.mine))));
const visibleProjects = code => projectsInVisible(code);
