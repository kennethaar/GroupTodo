/* Redraw just the timer, not the whole sidebar, once a second. */
function timerPaint(drag) {
  const b = $("#nav .nav-item.timer");
  if (!b) return;
  drag ??= b._drag;   // the dial's minutes being set, kept through the ticks
  const left = timerLeft(), dragging = drag != null;
  const bell = on => on ? " \u{1F514}\uFE0E" : " \u{1F515}\uFE0E";
  // Rung and not yet clicked away: the length it was set to, and the time since.
  const due = !dragging && left <= 0 && TIMER_DUE ? Math.max(0, Date.now() - TIMER_DUE) : -1;
  b.classList.toggle("running", left > 0 && !dragging);
  b.classList.toggle("dragging", dragging);
  b.classList.toggle("overdue", due >= 0);
  b.querySelector(".lbl").textContent = dragging ? drag.minutes + " min" + bell(drag.sound)
    : left > 0 ? clock(left) + bell(TIMER_SOUND)
    : due >= 0 ? Math.round(TIMER_LEN / 60000) + " min +" + clock(due) + bell(TIMER_SOUND) : "Timer";
  if (b.classList.contains("dial")) return timerPaintDial(b, drag, left, due);
  b.querySelector(".fill").style.width = (dragging ? drag.minutes / timerMax()
    : left > 0 && TIMER_LEN ? left / TIMER_LEN : 0) * 100 + "%";
  b.title = due >= 0 ? "The " + Math.round(TIMER_LEN / 60000) + " min alarm rang at "
      + new Date(TIMER_DUE).toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"})
      + ", " + clock(due) + " ago. Click to dismiss"
    : timerRinging() ? "Click to silence the alarm"
    : left > 0 ? "Click to stop, or drag to start over"
    : "Click for " + timerDefaultMinutes() + " min. Drag up or Ctrl-drag to ring, down or right to stay silent, up to " + timerMax() + " min";
}
