/* ============================================================
   113d_FIRST PROJECT -- the tour, as an actual project

   The coach above teaches the two moves the app is for: write one down, tick
   it off. Everything else -- contexts, planned dates, people, routines, the
   folder your files live in -- is a part of the interface nobody finds by
   being told it exists.

   So the first space gets one project, and its steps are doors: each one is a
   real TODO whose text carries a [[go/...]] link straight to the part of the
   app it is about. Pressing it takes you there. It is not a modal tour laid
   over the app, because a tour you cannot leave is a tour you resent, and it
   is not a help page either: it is on your list, it can be reordered,
   reworded, ignored, or ticked off unread like anything else, and when the
   last step closes the ordinary project-completion prompt files it away.

   The one thing added on top: going somewhere is remembered, and a step whose
   destination you have now seen is one the app offers to tick off for you --
   asked, never done behind your back, because the only person who knows
   whether you actually did it is you.
   ============================================================ */
const TOUR_PROP  = "tour";                  // tour:: 1  on the project page
const TOUR_TITLE = "Find your way round GroupToDo";

/* label: what the link reads as. go: where it actually goes. Nothing here is
   special-cased UI -- every destination is a thing the sidebar or a dialog can
   already reach, so the tour cannot drift away from the real app. */
const TOUR_DESTS = {
  todos:      {label: "Next",              go: () => go("next", {sub: "list"})},
  agenda:     {label: "Calendar",          go: () => go("next", {sub: "calendar"})},
  context:    {label: "Contexts",          go: () => go("contexts")},
  people:     {label: "People",            go: () => go("people")},
  projects:   {label: "Active projects",   go: () => go("projects", {statusCode: "1"})},
  checklists: {label: "Settings",  go: () => go("checklists")},
  horizons:   {label: "Horizons",          go: () => go("horizons", {horizonArea: null})},
  search:     {label: "Search",            go: () => goSearch()},
  today:      {label: "Journal",           go: () => go("today")},
  waiting:    {label: "Waiting for",       go: () => go("waiting", {sub: "board"})},
  someday:    {label: "Someday/Maybe",     go: () => go("projects", {sub: "list", statusCode: "2"})},
  solitaire:  {label: "Review projects",   go: () => go("review", {sub: "projects"})},
  actions:    {label: "Review actions",    go: () => go("review", {sub: "actions"})},
  days:       {label: "Clarify day pages", go: () => go("review", {sub: "days"})},
  reflect:    {label: "Reflect",           go: () => go("review", {sub: "reflect"})},
  weeks:      {label: "Look back and ahead", go: () => goReviewSection("weeks")},
  duel:       {label: "Rank someday/maybe", go: () => { go("review", {sub: "projects"}); solGoPass(SD_PASS); }},
  holdduel:   {label: "Rank on hold, no date", go: () => { go("review", {sub: "projects"}); solGoPass(HD_PASS); }},
  report:     {label: "What moved",        go: () => go("projects", {sub: "report"})},
  vault:      {label: "Vault & sync",      go: () => openVaultDialog()},
  capture:    {label: "Capture",           go: () => focusCapture()},
  review:     {label: "Weekly review",     go: () => go("review")},
  keys:       {label: "Help",              go: () => openHelp("keys")},
};
