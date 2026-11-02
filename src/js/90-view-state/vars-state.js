/* ============================================================
   90_VIEW_STATE
   ============================================================ */
const state = {
  view: "today",
  sub: null,            // which reading of the view: list, board, timeline...
  pagePath: null,
  context: null,        // CURRENT_CONTEXT from init.lua
  statusCode: "1",
  query: "",         // what the results on screen are for -- only Enter changes it
  searchDraft: "",   // what is in the box, which is not a search until you say so
  searchFilter: "all",
  selected: null,       // block id
  surfaced: [],         // ids of the 3 surfaced actions
  graphFocus: null,     // the page in the middle of the mind map
  graphEdit: false,     // whether a drag in the mind map writes a link
  jz: null,             // the section of Today you focused on
  todayWho: null,       // whose day page Today is showing
  todayDay: null,       // the day Today's journals are showing, or null for today
  todayWeek: null,      // the week the Journal shows with sub "week", or null for this week
  org: null,            // the organisation Projects is narrowed to
  ctxFilter: null,      // the context Next is narrowed to
  horizonArea: null,    // the one area Horizons is showing, or null for the ladder
  helpTopic: null,      // the topic the full help is open at
  planPath: null,       // the project Natural planning is on
  planSpace: null,      // and its area
  lastTodoTouch: Date.now(),
};
