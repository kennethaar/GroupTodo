/* mode: "move" | "start" | "end"; commit(days|iso) does the writing. */
function makeDraggable(barEl, {from, to, mode, commit}) {
  if (!GWIN) return;
  const grab = e => {
    if (e.button != null && e.button !== 0) return;
    const track = barEl.closest(".gtrack");
    if (!track) return;
    const width = track.getBoundingClientRect().width;
    if (!width) return;
    const perDay = width / GWIN.total;
    if (perDay <= 0) return;

    e.preventDefault();
    e.stopPropagation();
    const x0 = e.clientX;
    const left0 = parseFloat(barEl.style.left) || 0;
    const w0 = parseFloat(barEl.style.width) || 0;
    const tip = dragLabel();
    const follow = ev => { tip.style.left = ev.clientX + "px"; tip.style.top = ev.clientY + "px"; };
    follow(e);
    let days = 0, moved = false;

    try { barEl.setPointerCapture(e.pointerId); } catch (_) {}
    barEl.classList.add("dragging");

    // A bar cannot be dragged through its own far end, so an end drag is held
    // at the day the other end sits on rather than inverting the span.
    const barDays = Math.max(0, dateDiffDays(from, to));
    const clamp = () => mode === "start" ? Math.min(days, barDays)
                      : mode === "end"   ? Math.max(days, -barDays)
                      : days;
    const paint = () => {
      const d = clamp();
      const dPct = (d * perDay / width) * 100;
      if (mode === "move") barEl.style.left = (left0 + dPct) + "%";
      else if (mode === "start") {
        barEl.style.left = (left0 + dPct) + "%";
        barEl.style.width = Math.max(0.6, w0 - dPct) + "%";
      } else {
        barEl.style.width = Math.max(0.6, w0 + dPct) + "%";
      }
      const s = mode === "end"   ? from : shiftISO(from, d);
      const e = mode === "start" ? to   : shiftISO(to, d);
      tip.textContent = mode === "end"   ? "\u2192 " + e
                      : mode === "start" ? s + " \u2192"
                      : s + " \u2192 " + e;
    };

    const move = ev => {
      follow(ev);
      const next = Math.round((ev.clientX - x0) / perDay);
      if (next === days) return;
      days = next;
      if (days) moved = true;
      paint();
    };
    const up = () => {
      barEl.removeEventListener("pointermove", move);
      barEl.removeEventListener("pointerup", up);
      barEl.removeEventListener("pointercancel", up);
      barEl.classList.remove("dragging");
      tip.remove();
      const d = clamp();
      if (!moved || !d) { barEl.style.left = left0 + "%"; barEl.style.width = w0 + "%"; return; }
      GSUPPRESS = Date.now();
      commit(d);
    };
    barEl.addEventListener("pointermove", move);
    barEl.addEventListener("pointerup", up);
    barEl.addEventListener("pointercancel", up);
  };
  barEl.addEventListener("pointerdown", grab);
}
