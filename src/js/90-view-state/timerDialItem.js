function timerDialItem(it) {
  const max = timerMax();
  const part = (name, title, svg) => {
    const p = el("button", {class: "tpart", "data-part": name, title, type: "button"});
    p.innerHTML = svg;
    return p;
  };
  const dial = el("span", {class: "tdial", tabindex: "0", role: "slider",
    "aria-label": it.label, "aria-valuemin": "0", "aria-valuemax": String(max)});
  const quarters = [0, .25, .5, .75];
  // A quarter of a max that is not a multiple of 4 is written to one decimal.
  const nums = quarters.map(f => dialNumber(Math.round(f * max * 10) / 10, max));
  const box = 2 * (DIAL_C + DIAL_PAD);
  dial.innerHTML = `<svg viewBox="${-DIAL_PAD} ${-DIAL_PAD} ${box} ${box}" aria-hidden="true"><circle class="tface" cx="${DIAL_C}" cy="${DIAL_C}" r="${DIAL_R + 1}"/>`
    + `<path class="tsector"/>`
    + `<g class="tquart">${quarters.map(f => dialTick(f, 5)).join("")}</g>`
    + `<circle class="thub" cx="${DIAL_C}" cy="${DIAL_C}" r="2.5"/><g class="tnums">${nums.join("")}</g></svg>`;
  const b = el("div", {class: "nav-item small timer dial"},
    dial,
    el("span", {class: "tread"}, el("span", {class: "lbl"}, it.label), el("span", {class: "tsub"})),
    part("sound", "",
      SVG("icon-bell")),
    part("more", "Timer settings: length, max, style, volume",
      SVG("icon-dots")));

  const clamp = m => Math.max(1, Math.min(max, m));
  const click = part => {
    if (timerRinging()) return timerAck();
    if (part === "more") return timerSettingsMenu();
    if (part === "sound") return timerStart(timerDefaultMinutes(), true);
    if (timerLeft() > 0) timerStop(); else timerStart(timerDefaultMinutes(), false);
  };
  const show = (m, sound = TIMER_SOUND) => { b._drag = m == null ? null : {minutes: m, sound}; timerPaint(); };

  let down = null;   // {x, y, picked, sound} while the pointer is pressed
  b.addEventListener("pointerdown", e => {
    if (e.button || e.target.closest("[data-part]")) return;
    timerAudio();   // a press is a gesture; the wheel that may start it later is not
    down = {x: e.clientX, y: e.clientY, picked: null, sound: false};
    e.preventDefault(); dial.focus({preventScroll: true}); b.setPointerCapture(e.pointerId);
  });
  b.addEventListener("pointermove", e => {
    if (!down) return;
    const dx = e.clientX - down.x, dy = e.clientY - down.y;
    if (down.picked == null && Math.hypot(dx, dy) < 5) return;
    down.picked = clamp(Math.round(Math.hypot(dx, dy) / TIMER_PX));
    down.sound = timerDragRings(e, dx, dy);
    show(down.picked, down.sound);
  });
  const end = cancel => {
    if (!down) return;
    const {picked, sound} = down;
    down = null;
    show(null);
    if (cancel) return;
    if (picked != null) timerStart(picked, sound); else click(null);
  };
  b.addEventListener("pointerup", () => end(false));
  b.addEventListener("pointercancel", () => end(true));
  // The bell and the ⋯ are buttons of their own, so the keyboard reaches them.
  b.addEventListener("click", e => {
    const part = e.target.closest("[data-part]")?.dataset.part;
    if (part) click(part);
  });

  // The wheel and the arrow keys nudge it, and it starts once they stop.
  // Rolling down adds, the way pulling a dial towards you would.
  // A running timer keeps its sound; a new one is silent, like a click.
  let wait = null;
  const nudge = by => {
    const sound = b._drag?.sound ?? (timerLeft() > 0 && TIMER_SOUND);
    show(clamp((b._drag?.minutes ?? (timerLeft() > 0 ? Math.ceil(timerLeft() / 60000) : 0)) + by), sound);
    clearTimeout(wait);
    wait = setTimeout(() => { const d = b._drag; show(null); if (d) timerStart(d.minutes, d.sound); }, 1200);
  };
  dial.addEventListener("wheel", e => {
    e.preventDefault();
    if (e.deltaY) nudge((e.deltaY > 0 ? 1 : -1) * (e.shiftKey ? 5 : 1));
  }, {passive: false});
  dial.addEventListener("keydown", e => {
    const by = {ArrowUp: 1, ArrowRight: 1, ArrowDown: -1, ArrowLeft: -1, PageUp: 5, PageDown: -5}[e.key];
    if (by) { e.preventDefault(); return nudge(by * (e.shiftKey ? 5 : 1)); }
    if (e.key !== "Enter" && e.key !== " ") return;
    e.preventDefault();
    if (wait && b._drag) { clearTimeout(wait); const d = b._drag; show(null); return timerStart(d.minutes, d.sound); }
    click(null);
  });
  queueMicrotask(() => { timerPaint(); if ((TIMER_END || TIMER_DUE) && !TIMER_TICK) timerRun(); });
  return b;
}
