function ganttGroupRow(row, pct) {
  const g = row.group;
  const open = state.ganttOpen === g.path;
  const left = pct(row.start), right = pct(row.end);
  const movable = row.openN > 0;

  const shift = days => {
    const n = inSpace(g.space, () => shiftProjectBy(g.path, days));
    if (!n) { notify("Nothing open and dated in there to move.", "warn"); return; }
    notify("Moved " + g.label + " " + Math.abs(days) + " day" + (Math.abs(days) === 1 ? "" : "s") +
           (days > 0 ? " later" : " earlier") + " · " + n + " task" + (n === 1 ? "" : "s") + ".");
    if (g.project) offerCascade(g.space, g.path);
    render();
  };

  const barEl = el("span", {class: ganttBarClass(row.openN ? "TODO" : "DONE",
                                                 row.late ? "0000-00-00" : row.end) +
                             (movable ? " movable" : "") + (g.trouble ? " clash" : ""),
    data: {proj: g.project ? g.path : ""},
    style: "left:" + left + "%;width:" + Math.max(0.6, right - left) + "%",
    title: row.start + " → " + row.end +
           (movable ? "  ·  drag to move the whole project" : "")});
  if (movable) makeDraggable(barEl, {from: row.start, to: row.end, mode: "move", commit: shift});

  const track = el("span", {class: "gtrack"}, barEl);
  /* Where the chain says this project is free to start. Drawn even when the bar
     is clear of it, because "it only just fits" is worth seeing too. */
  if (g.deps && g.deps.length) {
    const need = inSpace(g.space, () => earliestStart(g.path));
    if (need && need >= GWIN.from && need <= GWIN.to)
      track.append(el("span", {class: "ggate" + (g.trouble ? " bad" : ""),
        style: "left:" + pct(need) + "%",
        title: "Cannot start before " + need + " - waiting on " +
               inSpace(g.space, () => g.deps.map(pageTitle).join(", "))}));
  }

  const rowEl = el("button", {class: "grow group" + (open ? " open" : "") + (movable ? " movable" : ""),
    data: {row: g.path},
    onclick: () => {
      if (swallowedDrag()) return;
      go("projects", {sub: "timeline", ganttOpen: open ? null : g.path});
    },
  },
    el("span", {class: "glabel"},
      el("span", {class: "caret"}, open ? "▾" : "▸"),
      // The name gets the whole width and may wrap to three lines; the count
      // goes under it rather than beside it, so it never eats the name.
      el("span", {class: "gname"},
        el("span", {class: "nm", title: g.label +
          (g.deps && g.deps.length
            ? " - after " + inSpace(g.space, () => g.deps.map(pageTitle).join(", "))
            : "")}, g.label),
        el("span", {class: "n"}, row.late ? "late" : row.openN ? row.openN + " open" : "done")),
      g.blockers && g.blockers.length
        ? el("span", {class: "gdep", title: "Waiting on " +
            inSpace(g.space, () => g.blockers.map(pageTitle).join(", "))}, "⇠") : null,
      // A button cannot sit inside the row's button, so this is a span that acts as one.
      el("span", {class: "gopen", role: "button", tabindex: "0", title: "Open " + g.label,
        onclick: e => { e.stopPropagation(); previewPage(g.space, g.path); },
        onkeydown: e => { if (e.key === "Enter") { e.preventDefault(); e.stopPropagation(); previewPage(g.space, g.path); } }}, "↗")),
    track);
  if (movable) nudgeKeys(rowEl, shift);
  return rowEl;
}
