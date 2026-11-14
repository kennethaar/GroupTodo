/* The drag itself. Nothing happens until the pointer has actually left the
   line it started on, so this is invisible until it is wanted. */
function attachLineSelect(outline, path) {
  outline.addEventListener("mousedown", e => {
    if (e.button !== 0) return;
    const start = e.target.closest(".blk");
    if (!start || !outline.contains(start)) return;
    // A press on a control, a link or the bullet is that thing's press.
    if (e.target.closest("button, a, input, textarea, select, [data-link], .bullet, .pfacts")) return;

    // Ctrl picks this one line, besides whatever is picked already.
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
      const sel = getSelection();
      if (sel) sel.removeAllRanges();
      lineSelToggle(outline, path, start);
      return;
    }

    const y0 = e.clientY;
    // A plain line under a bullet is a line too: leaving it is leaving the line.
    const unitOf = n => n && n.closest ? n.closest(".txt, .bodyline") : null;
    const startUnit = unitOf(e.target);
    let live = false;

    const move = ev => {
      /* Every layer under the pointer, not just the top one: the toolbar that
         floats by the line being edited can lie over the next line, and the
         line under it is still the one being dragged onto. */
      const layers = document.elementsFromPoint(ev.clientX, ev.clientY);
      const blk = layers.map(n => n.closest ? n.closest(".blk") : null).find(n => n && outline.contains(n)) || null;
      const unit = layers.map(unitOf).find(n => n && outline.contains(n)) || null;
      if (!live) {
        if (!blk || !outline.contains(blk) || (blk === start && (!unit || unit === startUnit))) return;
        if (Math.abs(ev.clientY - y0) < 6) return;
        live = true;
        document.body.classList.add("lselecting");
        // The line the press landed in had started a caret selection of its
        // own; it is not what is being asked for any more.
        if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
        LINE_SEL.path = path;
      }
      ev.preventDefault();
      const sel = getSelection();
      if (sel) sel.removeAllRanges();
      const end = blk && outline.contains(blk) ? blk : start;
      LINE_SEL.ids = blksBetween(outline, start, end).map(n => n.dataset.id).filter(Boolean);
      LINE_SEL.anchor = start.dataset.id; LINE_SEL.head = end.dataset.id;
      paintLineSel();
    };

    const up = () => {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", up);
      document.body.classList.remove("lselecting");
      if (!live) return;
      // The click that follows this mouseup would drop the caret into a line
      // and let the picked lines go, so it is swallowed once.
      const eat = ev => { ev.preventDefault(); ev.stopPropagation(); };
      document.addEventListener("click", eat, {capture: true, once: true});
      /* Only that click: when none comes (the button let go outside the
         window), the next real click, on a dialog's button, went too. */
      setTimeout(() => document.removeEventListener("click", eat, {capture: true}), 0);
    };
    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", up);
  });
  return outline;
}
