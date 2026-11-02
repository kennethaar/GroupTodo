/* ---------- staying where you were ----------
   Any change rebuilds the whole screen, which means every scrollable thing in
   it starts again at the top. So the scroll positions are read before the
   rebuild and put back after it, keyed by a name rather than by position in
   the DOM. Every view remembers its own place; a view seen for the first time
   starts at the top. */
const VIEW_SCROLL = new Map();
