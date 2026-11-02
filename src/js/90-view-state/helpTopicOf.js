/* The topic for the screen you are on: its view and sub, else the view's own. */
function helpTopicOf(view, sub) {
  const ids = Object.keys(HELP);
  return ids.find(id => HELP[id].view === view && (HELP[id].sub || null) === (sub || null))
    || ids.find(id => HELP[id].view === view) || "start";
}
