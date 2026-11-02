function ganttTaskRow(t, pct) {
  const left = pct(t.span.start), right = pct(t.span.end);
  const movable = canMoveTask(t.block);

  const after = (what, msg) => () => {
    touch(t.path);
    GSUPPRESS = Date.now();
    notify(msg);
    render();
  };
  const commitMove = days => inSpace(t.space, () => {
    if (!shiftTaskBy(t.path, t.block, days)) return;
    const s = spanOf(t.block, null);
    after(null, "Moved to " + s.start + " → " + s.end + ".")();
  });
  const commitStart = days => inSpace(t.space, () => {
    if (!setTaskStart(t.path, t.block, shiftISO(t.span.start, days))) return;
    after(null, "Starts " + dateIn(blockProp(t.block, "SCHEDULED")) + ".")();
  });
  const commitEnd = days => inSpace(t.space, () => {
    if (!setTaskEnd(t.path, t.block, shiftISO(t.span.end, days))) return;
    after(null, "Due " + dateIn(blockProp(t.block, "DEADLINE")) + ".")();
  });

  const barEl = el("span", {class: ganttBarClass(t.state, t.span.end) + (movable ? " movable" : ""),
    style: "left:" + left + "%;width:" + Math.max(0.6, right - left) + "%",
    title: t.span.start + " → " + t.span.end + "  ·  " + t.state +
           (movable ? "  ·  drag to move, drag an end to stretch" : "  ·  closed, so it stays put")},
    el("span", {class: "glabelin"}, plainTitle(t.title)));
  if (movable) {
    makeDraggable(barEl, {from: t.span.start, to: t.span.end, mode: "move", commit: commitMove});
    /* Grips only on a bar wide enough to still leave something in the middle:
       two of them on a one-day bar ARE the bar, and it could then only be
       stretched, never moved. A narrow bar keeps the Alt+arrow keys and the
       two date fields in its own panel. */
    if (right - left >= 2.2) {
      const lh = el("span", {class: "ghandle l", title: "Drag to change when it starts"});
      const rh = el("span", {class: "ghandle r", title: "Drag to change when it is due"});
      barEl.append(lh, rh);
      makeDraggable(lh, {from: t.span.start, to: t.span.end, mode: "start", commit: commitStart});
      makeDraggable(rh, {from: t.span.start, to: t.span.end, mode: "end",   commit: commitEnd});
    }
  }

  const rowEl = el("button", {class: "grow task" + (movable ? " movable" : ""),
    onclick: () => {
      if (swallowedDrag()) return;
      inSpace(t.space, () => openTaskDetail(t.path, t.block, t.space));
    }},
    el("span", {class: "glabel sub"},
      el("span", {class: "nm", title: plainTitle(t.title)}, plainTitle(t.title))),
    el("span", {class: "gtrack"}, barEl));
  if (movable) nudgeKeys(rowEl, commitMove);
  return rowEl;
}
