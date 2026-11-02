/* Open leaf actions: an open item with no open children is the actionable one.
   With several spaces shown, this runs once per space and tags each result. */
function leafActions() { return memo("leafActions", () => allLeafActions().filter(a => !a.held)); }
