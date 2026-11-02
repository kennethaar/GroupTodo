/* On a phone the line Enter makes goes to the middle of what is left of the
   page above the keyboard and the line toolbar, rather than wherever the
   browser's own scrolling leaves it, which is the bottom edge or under the
   keyboard. Called after the focus, so it runs in the frame after it, and
   again when the keyboard has finished coming up. */
function centerNewLine(sel) {
  const c = $("#content"), vv = window.visualViewport;
  if (!c || !matchMedia("(pointer:coarse)").matches) return;
  c.classList.add("roomunder");
  const go = () => {
    const node = $(sel);
    if (!node || document.activeElement !== node) return;
    const cr = c.getBoundingClientRect(), bar = $("#editBar");
    const top = Math.max(cr.top, vv ? vv.offsetTop : 0);
    const bot = Math.min(cr.bottom, (vv ? vv.offsetTop + vv.height : innerHeight) -
      (bar && !bar.hidden ? bar.offsetHeight : 0));
    const r = node.getBoundingClientRect();
    c.scrollTop += Math.round(r.top + Math.min(r.height, 40) / 2 - (top + bot) / 2);
  };
  requestAnimationFrame(go);
  if (vv) {
    const again = () => requestAnimationFrame(go);
    vv.addEventListener("resize", again);
    setTimeout(() => vv.removeEventListener("resize", again), 800);
  }
}
