function aroundRingTo(grid, node) {
  const ring = aroundRing(grid);
  if (!node) { ring.classList.remove("on"); return; }
  const g = grid.getBoundingClientRect(), r = node.getBoundingClientRect();
  const first = !ring.classList.contains("on");
  if (first) ring.style.transition = "none";
  ring.style.width = r.width + "px";
  ring.style.height = r.height + "px";
  ring.style.transform = "translate(" + (r.left - g.left) + "px," + (r.top - g.top) + "px)";
  ring.classList.add("on");
  if (first) requestAnimationFrame(() => { ring.style.transition = ""; });
}
