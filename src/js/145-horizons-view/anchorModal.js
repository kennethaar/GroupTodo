/* A dialog opened from something small sits beside it, the way a menu does,
   kept inside the window. On a narrow screen it stays the sheet at the
   bottom, which a finger can always reach and the edge never cuts off. */
function anchorModal(sheet, anchor) {
  if (!sheet || !anchor || !anchor.isConnected || matchMedia("(max-width: 640px)").matches) return;
  const scrim = sheet.parentNode;
  scrim.classList.add("anchored");
  const r = anchor.getBoundingClientRect(), gap = 6, edge = 8;
  const w = sheet.offsetWidth, h = sheet.offsetHeight;
  const left = Math.max(edge, Math.min(r.left, innerWidth - w - edge));
  let top = r.bottom + gap;
  if (top + h > innerHeight - edge) top = Math.max(edge, r.top - gap - h);
  sheet.style.left = left + "px";
  sheet.style.top = top + "px";
}
