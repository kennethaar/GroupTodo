/* The right-hand side: a filter bar over groups of cards. The text filter only
   hides cards, so typing never loses focus to a re-render. */
function assignTargets(parts, controls, placeholder) {
  const search = el("input", {type: "search", placeholder, "aria-label": placeholder});
  const wrap = el("div", {});
  search.addEventListener("input", () => {
    const q = search.value.trim().toLowerCase();
    wrap.querySelectorAll("[data-q]").forEach(n => n.style.display = !q || n.dataset.q.includes(q) ? "" : "none");
    wrap.querySelectorAll(".group").forEach(g => {
      const grid = g.nextElementSibling;
      g.style.display = grid && [...grid.children].some(n => n.style.display !== "none") ? "" : "none";
    });
  });
  wrap.append(el("div", {class: "assign-bar"}, search, ...controls.filter(Boolean)), ...parts);
  return wrap;
}
