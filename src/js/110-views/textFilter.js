function textFilter(key, placeholder, rows, hay, draw) {
  const host = el("div", {});
  const run = () => {
    const q = trim(LIST_Q.get(key) || "");
    const words = q.toLowerCase().split(/\s+/).filter(Boolean);
    const hits = words.length ? rows.filter(r => { const h = hay(r).toLowerCase(); return words.every(w => h.includes(w)); }) : rows;
    host.replaceChildren(...[draw(hits, q)].flat().filter(Boolean));
  };
  const input = el("input", {type: "search", placeholder, "aria-label": placeholder, value: LIST_Q.get(key) || "",
    oninput: e => { LIST_Q.set(key, e.target.value); run(); },
    onkeydown: e => { if (e.key === "Escape" && e.target.value) { e.preventDefault(); e.stopPropagation(); e.target.value = ""; LIST_Q.delete(key); run(); } }});
  run();
  return {input, host};
}
