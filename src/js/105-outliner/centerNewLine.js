/* On a phone the line Enter makes goes to the middle of what is left of the
   page above the keyboard and the line toolbar, rather than wherever the
   browser's own scrolling leaves it, which is the bottom edge or under the
   keyboard. Called after the focus, so it runs in the frame after it, and
   again when the keyboard has finished coming up.
   On a computer the page moves only as far as it must: the browser keeps the
   caret inside the page, but not clear of the line toolbar over its bottom. */
function centerNewLine(sel) {
  const c = $("#content"), vv = window.visualViewport;
  if (!c) return;
  const phone = matchMedia("(pointer:coarse)").matches;
  if (phone) c.classList.add("roomunder");
  const go = () => {
    const node = $(sel);
    if (!node || document.activeElement !== node) return;
    const {top, bot} = typingBand(c);
    const r = node.getBoundingClientRect();
    if (phone) { c.scrollTop += Math.round(r.top + Math.min(r.height, 40) / 2 - (top + bot) / 2); return; }
    const gap = 8;
    if (r.bottom > bot - gap) c.scrollTop += Math.ceil(r.bottom - bot + gap);
    else if (r.top < top + gap) c.scrollTop -= Math.ceil(top + gap - r.top);
  };
  requestAnimationFrame(go);
  if (phone && vv) {
    const again = () => requestAnimationFrame(go);
    vv.addEventListener("resize", again);
    setTimeout(() => vv.removeEventListener("resize", again), 800);
  }
}
