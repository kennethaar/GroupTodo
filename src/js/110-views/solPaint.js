/* Enlarge one box and one pill, and only those. `quiet` puts them in place
   without the transition, after a redraw has replaced the elements. */
function solPaint(k, pill, {quiet = false, typing = false, x = null, y = null} = {}) {
  const box = solBox(k);
  for (const b of document.querySelectorAll(".sol .solzoom, .sol .soltype, .sol .solfit, .sol [data-grown]"))
    if (b !== box) { b.classList.remove("solzoom", "soltype", "solfit"); solShrink(b); }
  for (const p of document.querySelectorAll(".sol .solmag, .sol .solnear"))
    if (p !== pill) p.classList.remove("solmag", "solnear");
  if (!box) return;
  if (quiet) box.style.transition = "none";
  if (solZoomOn()) { box.classList.add("solzoom"); solGrow(box); }
  box.classList.toggle("soltype", typing && box.classList.contains("write"));
  const pills = solPills(box);
  const at = pill ? pills.indexOf(pill) : -1;
  /* A pill grows around the pointer (or its own middle), kept inside its box,
     so the one at the edge is not cut off and the words under the pointer stay put. */
  const br = box.getBoundingClientRect();
  pills.forEach((p, i) => {
    if (p === box) return;
    const mag = i === at, near = at >= 0 && Math.abs(i - at) === 1;
    if ((mag || near) && !p.classList.contains(mag ? "solmag" : "solnear")) {
      const r = p.getBoundingClientRect(), sc = mag ? 1.35 : 1.1;
      const px = mag && x != null ? x : r.left + r.width / 2, py = mag && y != null ? y : r.top + r.height / 2;
      p.style.transformOrigin = solFit(px, r.left, r.width, br.left + 2, br.right - 2, sc) * 100 + "% " +
        solFit(py, r.top, r.height, br.top + 2, br.bottom - 2, sc) * 100 + "%";
    }
    p.classList.toggle("solmag", mag);
    p.classList.toggle("solnear", near);
  });
  if (quiet) { void box.offsetWidth; box.style.transition = ""; }
}
