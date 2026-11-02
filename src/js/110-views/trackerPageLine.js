/* ---------- the page ---------- */
/* Under the name: what it is, when it comes, its area, and renaming or
   stopping it. These live elsewhere, so they are read here, not typed. */
function trackerPageLine(name) {
  const g = trackerGroup(name), w = trackerWhen(name), key = g?.key || w.key || "tracker-" + name;
  const area = trackerArea(name), sep = () => el("span", {class: "sep"}, "·");
  const areas = visibleSpaces().filter(sp => LOADED.has(sp)).length > 1;
  return el("div", {class: "trkpageline"},
    el("code", {}, key), sep(), el("span", {}, trackerKindWords(g?.code || "")), sep(),
    el("span", {}, describeWhen(w.when)),
    el("button", {class: "textbtn", title: "Which days it comes on, kept in the journal templates",
      onclick: () => openTrackerWhen(name, key)}, "Change…"),
    ...(areas ? [sep(), el("button", {class: "textbtn", title: "The area it belongs to. Click to move it; the days filled in stay",
      onclick: () => openMoveTracker(name, area, todayISO())}, capitalise(area))] : []),
    sep(), el("button", {class: "textbtn", title: "On every day and template, the history kept",
      onclick: () => renameTrackerPrompt(name)}, "Rename"),
    sep(), el("button", {class: "textbtn", title: "No more of it on new days; the history stays",
      onclick: () => stopTrackerPrompt(name)}, "Stop"));
}
