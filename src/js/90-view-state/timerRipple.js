/* Three rings out from the timer to the far corner of the window; from the
   top left when the sidebar is out of sight. */
function timerRipple() {
  document.querySelector(".timer-ripple")?.remove();
  const t = $("#nav .nav-item.timer .tdial") || $("#nav .nav-item.timer");
  const r = t?.getBoundingClientRect(), seen = r && r.width > 0;
  const x = seen ? r.left + r.width / 2 : 0, y = seen ? r.top + r.height / 2 : 0;
  const R = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
  const wrap = el("div", {class: "timer-ripple", "aria-hidden": "true"});
  for (let i = 0; i < 3; i++) {
    const ring = el("i");
    Object.assign(ring.style, {left: x + "px", top: y + "px", width: 2 * R + "px", height: 2 * R + "px",
      animationDelay: i * 0.9 + "s"});
    wrap.append(ring);
  }
  document.body.append(wrap);
  setTimeout(() => wrap.remove(), 2 * 900 + 1600 + 200);
}
