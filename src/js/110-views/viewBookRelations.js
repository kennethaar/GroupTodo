function viewBookRelations(c) {
  const chapters = bookChapters(), last = Math.max(0, chapters.length - 1);
  const clamp = n => Math.min(last, Math.max(0, n));
  let from = clamp(+PREF.get("book.rel.from", "0") || 0), to = clamp(+PREF.get("book.rel.to", String(last)));
  if (to < from) to = from;
  const name = i => chapters[i] ? (chapters[i].path ? pageTitle(chapters[i].path) : chapters[i].name) : "";
  const opts = chapters.map((ch, i) => [String(i), (i + 1) + ". " + name(i)]);
  c.append(vhead(bookName(), null, viewSeg("book")));
  if (chapters.length > 1) c.append(fbar(el("span", {class: "say"}, "From"),
    fselect("From chapter", String(from), opts, v => { PREF.set("book.rel.from", v); render(); }),
    el("span", {class: "say"}, "to"),
    fselect("To chapter", String(to), opts, v => { PREF.set("book.rel.to", v); render(); })));
  const {pairs, seen} = bookRelations(from, to), hero = bookProtagonist();
  const byKey = new Map(castEntries().map(e => [e.key, e]));
  const nodes = [...new Set([...seen.keys(), ...pairs.filter(p => p.said.length).flatMap(p => [p.a, p.b])])]
    .filter(k => byKey.has(k)).sort((a, b) => (b === hero) - (a === hero) || (seen.get(b) || 0) - (seen.get(a) || 0));
  if (nodes.length < 2) {
    c.append(emptyCard("Two characters in a scene, or one page that names another, make a tie to draw."));
    return c;
  }
  if (REL.sel && !nodes.includes(REL.sel)) REL.sel = null;
  /* The protagonist in the middle, the rest on a ring; with no protagonist in
     the picture, everybody on the ring. */
  const W = 640, H = 460, cx = W / 2, cy = H / 2, R = Math.min(W, H) / 2 - 60;
  const ring = nodes.filter(k => !(k === hero && nodes.length > 2)), at = new Map();
  if (ring.length !== nodes.length) at.set(hero, [cx, cy]);
  ring.forEach((k, i) => { const t = -Math.PI / 2 + 2 * Math.PI * i / ring.length; at.set(k, [cx + R * Math.cos(t), cy + R * Math.sin(t)]); });
  const most = Math.max(1, ...pairs.map(p => p.scenes + p.talk)), big = Math.max(1, ...nodes.map(k => seen.get(k) || 0));
  const NS = "http://www.w3.org/2000/svg";
  const sv = (tag, attrs, ...kids) => { const n = document.createElementNS(NS, tag); for (const k in attrs) n.setAttribute(k, attrs[k]); n.append(...kids); return n; };
  const svg = sv("svg", {viewBox: `0 0 ${W} ${H}`, class: "relsvg", role: "img", "aria-label": "Ties between the characters"});
  const touches = p => !REL.sel || p.a === REL.sel || p.b === REL.sel;
  for (const p of pairs) {
    if (!at.has(p.a) || !at.has(p.b)) continue;
    const [x1, y1] = at.get(p.a), [x2, y2] = at.get(p.b), w = p.scenes + p.talk;
    svg.append(sv("line", {x1, y1, x2, y2, class: "reledge" + (w ? "" : " said") + (touches(p) ? "" : " dim") + (p.talk ? " talk" : ""),
      "stroke-width": String(w ? 1 + 5 * w / most : 1.2)}));
    if (p.said.length && touches(p))
      svg.append(sv("text", {x: (x1 + x2) / 2, y: (y1 + y2) / 2 - 4, class: "rellabel", "text-anchor": "middle"}, p.said.join(", ")));
  }
  for (const k of nodes) {
    const [x, y] = at.get(k), e = byKey.get(k), r = 7 + 11 * Math.sqrt((seen.get(k) || 0) / big);
    const near = !REL.sel || k === REL.sel || pairs.some(p => touches(p) && (p.a === k || p.b === k));
    const g = sv("g", {class: "relnode" + (k === REL.sel ? " sel" : "") + (k === hero ? " hero" : "") + (near ? "" : " dim"),
      tabindex: "0", role: "button", "aria-label": e.name, "data-key": k},
      sv("circle", {cx: x, cy: y, r}), sv("text", {x, y: y + r + 14, "text-anchor": "middle"}, e.name));
    const pick = () => { REL.sel = REL.sel === k ? null : k; render(); };
    g.addEventListener("click", pick);
    g.addEventListener("keydown", ev => { if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); pick(); } });
    svg.append(g);
  }
  c.append(el("div", {class: "card relcard"}, svg));
  // The same ties in words, strongest first: the picture's legend, and readable without it.
  const rows = pairs.filter(touches).filter(p => byKey.has(p.a) && byKey.has(p.b))
    .sort((x, y) => (y.scenes + y.talk) - (x.scenes + x.talk) || y.said.length - x.said.length);
  c.append(section(REL.sel ? "Ties of " + byKey.get(REL.sel).name : "Ties", rows.length, el("div", {class: "card rellist"}, ...rows.map(p =>
    el("div", {class: "relrow"},
      el("span", {class: "nm"}, byKey.get(p.a).name + " – " + byKey.get(p.b).name),
      p.said.length ? el("span", {class: "chip relsaid"}, p.said.join(", ")) : null,
      el("span", {class: "sub"}, [p.scenes ? p.scenes + (p.scenes === 1 ? " scene" : " scenes") : "",
        p.talk ? p.talk + (p.talk === 1 ? " exchange" : " exchanges") : ""].filter(Boolean).join(" · ") || "only on their pages"))))));
  return c;
}
