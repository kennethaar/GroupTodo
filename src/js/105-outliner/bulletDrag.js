/* #423 The bullet is the line's handle: drag it to move the line, with all
   under it. The top or bottom edge of another line drops it before or after
   that line (a bar shows where); the middle of a line takes it in as its last
   line (the line is marked). A phone holds the bullet a moment first, so a
   quick swipe moves nothing. Esc stops a drag. Lines stay in their own area. */
function bulletDrag(btn, path, b) {
  btn.addEventListener("pointerdown", e => {
    if (e.button) return;
    const touchy = e.pointerType === "touch";
    const x0 = e.clientX, y0 = e.clientY, space = V.space, own = btn.closest(".blk");
    let armed = !touchy, live = false, hit = null, bar = null;
    const hold = touchy ? setTimeout(() => { armed = true; own.classList.add("dragheld"); try { navigator.vibrate?.(15); } catch (_) {} }, 400) : 0;
    const far = (ev, n) => Math.hypot(ev.clientX - x0, ev.clientY - y0) > n;
    const unmark = () => {
      if (bar) { bar.remove(); bar = null; }
      document.querySelectorAll(".blk.dropinto").forEach(n => n.classList.remove("dropinto"));
    };
    const target = ev => {
      const line = document.elementFromPoint(ev.clientX, ev.clientY)?.closest(".blk > .line");
      const blk = line?.parentElement;
      if (!blk || blk.dataset.space !== space || own.contains(blk)) return null;
      const r = line.getBoundingClientRect(), f = (ev.clientY - r.top) / (r.height || 1);
      return {blk, line, where: f < 0.25 ? "before" : f > 0.75 ? "after" : "into"};
    };
    const move = ev => {
      if (!armed) { if (far(ev, 6)) stop(); return; }
      if (!live) {
        if (!far(ev, 3)) return;
        live = true;
        own.classList.add("dragging");
        document.body.classList.add("linedrag");
      }
      if (ev.cancelable) ev.preventDefault();
      unmark();
      hit = target(ev);
      if (!hit) return;
      if (hit.where === "into") { hit.blk.classList.add("dropinto"); return; }
      const r = hit.line.getBoundingClientRect(), txt = hit.line.querySelector(".txt");
      const left = txt ? txt.getBoundingClientRect().left : r.left;
      bar = el("div", {class: "dropbar", "aria-hidden": "true",
        style: "left:" + left + "px;width:" + Math.max(40, r.right - left) + "px;top:" + ((hit.where === "before" ? r.top : r.bottom) - 1) + "px"});
      document.body.append(bar);
    };
    const stop = () => {
      clearTimeout(hold);
      unmark();
      own.classList.remove("dragging", "dragheld");
      document.body.classList.remove("linedrag");
      document.removeEventListener("pointermove", move);
      document.removeEventListener("pointerup", up);
      document.removeEventListener("pointercancel", stop);
      document.removeEventListener("keydown", esc, true);
    };
    const up = () => {
      const h = live && hit;
      stop();
      if (h) dropLine(space, b.id, h.blk.dataset.id, h.where);
    };
    const esc = ev => { if (ev.key === "Escape") { ev.preventDefault(); ev.stopPropagation(); hit = null; stop(); } };
    document.addEventListener("pointermove", move);
    document.addEventListener("pointerup", up);
    document.addEventListener("pointercancel", stop);
    document.addEventListener("keydown", esc, true);
  });
}
