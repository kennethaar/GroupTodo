document.addEventListener("keydown", e => {
  if (e.key !== "Escape" || !TRAY_ARMED) return;
  TRAY_ARMED = null;
  document.body.classList.remove("armed-on");
  document.querySelectorAll(".pchip.armed").forEach(x => x.classList.remove("armed"));
});
