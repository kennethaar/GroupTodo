/* [[go/help-<topic>]] goes to that topic of the help, so the tour, a page or
   a dialog can point at the words for what it shows. */
function tourDest(id) {
  if (TOUR_DESTS[id]) return TOUR_DESTS[id];
  const topic = /^help-(.+)$/.exec(id || "");
  return topic && HELP[topic[1]] ? {label: HELP[topic[1]].title, go: () => openHelp(topic[1])} : null;
}
