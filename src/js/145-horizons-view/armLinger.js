function armLinger() {
  if (LINGER_TICK) return;
  LINGER_TICK = setInterval(() => {
    let gone = false;
    for (const [id, l] of LINGER) if (l.until <= Date.now()) { LINGER.delete(id); gone = true; }
    document.querySelectorAll(".chip.linger").forEach(n => { n.querySelector(".secs").textContent = lingerSays(+n.dataset.until); });
    if (!LINGER.size) { clearInterval(LINGER_TICK); LINGER_TICK = null; }
    if (gone) render();
  }, 250);
}
