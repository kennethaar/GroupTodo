/* A day page shows only its trackers at the top: the rest of its values are
   the file's bookkeeping. One more is added the way the line menu adds one;
   the cross takes one off this day. add: false leaves out the "+ tracker",
   for an area that is not where new trackers go; move, the area the page is
   in, offers to move a tracker to another. */
function dayTrackersBlock(path, {add = true, move = null} = {}) {
  const props = getPage(path)?.props || {};
  const box = el("div", {class: "pfacts"});
  for (const [k, v] of Object.entries(props)) {
    const trk = parseTracker(k + ":: " + v);
    /* A value of your own written at the top of the day -- pushups:: 20, the
       way a Logseq journal template writes them -- is shown with the trackers,
       so it can be filled in here and compared with last time. */
    if (!trk && !isDayValueKey(k)) continue;
    const fact = propFact(path, k, v);
    // A day's number is written, not chosen from the values other pages used.
    if (!trk) fact.own = true;
    const line = factLine(path, fact);
    const prev = prevValueEl(path, prevKeyOf(k, v));
    if (prev) line.append(prev);
    // One menu, not a bare cross: on a phone the cross could not be seen and was tapped by mistake (#180).
    if (trk) line.append(el("button", {class: "textbtn trkx", title: "Edit, move or remove",
      "aria-label": "Edit " + trackerTitle(trk.name),
      onclick: () => openDayTrackerMenu(path, k, move)}, "⋯"));
    box.append(line);
  }
  if (!add) return box;
  const line = el("div", {class: "pfact"});
  // An empty day says so in words; the way to add one waits for the pointer (#160).
  if (!box.childElementCount) line.append(el("span", {class: "trknone"}, "Nothing tracked yet."));
  line.append(el("button", {class: "textbtn trkadd", title: "Something to follow over time",
    onclick: () => openTrackerPicker((title, when) => insertTracker(path, newBlock({title: ""}, false), title, when), path)},
    "+ tracker"));
  box.append(line);
  return box;
}
