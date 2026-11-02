/* Positions survive a redraw, so ticking something off in the detail panel does
   not reshuffle the whole picture under your cursor -- and a reload, so opening
   the app again does not build the map from nothing. Only "Lay it out again"
   starts it over. */
const GRAPH_POS_KEY = "grouptodo.graphpos";
const GRAPH_POS = (() => {
  try { return new Map(JSON.parse(localStorage.getItem(GRAPH_POS_KEY) || "[]")); } catch (_) { return new Map(); }
})();
