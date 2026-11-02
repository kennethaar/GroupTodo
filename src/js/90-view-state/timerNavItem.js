function timerNavItem(it) {
  if (timerDialStyle()) return timerDialItem(it);
  /* Bell on the left starts the usual length with the alarm, the stopwatch on
     the right starts it silent. */
  const part = (name, title, svg) => {
    const p = el("span", {class: "tpart", "data-part": name, title});
    p.innerHTML = svg;
    return p;
  };
  const b = el("button", {class: "nav-item small timer"},
    el("span", {class: "fill"}),
    part("bell", "Usual length, with the alarm",
      SVG("icon-bell")),
    el("span", {class: "lbl"}, it.label),
    part("silent", "Usual length, silent",
      SVG("icon-stopwatch")),
    part("more", "Timer settings: length, max, style, volume",
      SVG("icon-dots")));
  let down = null;   // {x, y, picked} while the pointer is pressed
  const pick = e => {
    const dx = e.clientX - down.x, dy = e.clientY - down.y;
    return {minutes: Math.max(1, Math.min(timerMax(), Math.round(Math.hypot(dx, dy) / TIMER_PX))),
            sound: timerDragRings(e, dx, dy)};
  };
  b.addEventListener("pointerdown", e => {
    if (e.button) return;
    down = {x: e.clientX, y: e.clientY, picked: null, part: e.target.closest("[data-part]")?.dataset.part};
    b.setPointerCapture(e.pointerId);
  });
  b.addEventListener("pointermove", e => {
    if (!down) return;
    if (down.picked == null && Math.hypot(e.clientX - down.x, e.clientY - down.y) < 5) return;
    down.picked = pick(e);
    timerPaint(down.picked);
  });
  const end = (e, cancel) => {
    if (!down) return;
    const {picked, part} = down;
    down = null;
    if (cancel) return timerPaint();
    if (picked == null && timerRinging()) return timerAck();
    if (picked == null && part === "more") return timerSettingsMenu();
    if (picked != null) timerStart(picked.minutes, picked.sound);
    else if (timerLeft() > 0) timerStop();
    else timerStart(timerDefaultMinutes(), part !== "silent");
  };
  b.addEventListener("pointerup", e => end(e, false));
  b.addEventListener("pointercancel", e => end(e, true));
  b.addEventListener("keydown", e => {
    if (e.key !== "Enter" && e.key !== " ") return;
    e.preventDefault();
    if (timerRinging()) timerAck();
    else if (timerLeft() > 0) timerStop(); else timerStart(timerDefaultMinutes());
  });
  queueMicrotask(() => { timerPaint(); if ((TIMER_END || TIMER_DUE) && !TIMER_TICK) timerRun(); });
  return b;
}
