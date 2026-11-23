/* A table slide (#469): the table as written, its columns aligned as the
   | --- | line says. Each cell that → brings carries data-tpart, its row
   or its column; the header (or the first column) has none and shows at once. */
function drawTable(s) {
  const t = s.kids[0], n = tableRows(t), cols = slideTableCols(t);
  const al = tableCells(t.body[0]).map(tableAlign);
  const cell = (tag, words, r, c) => el(tag, {style: "text-align:" + (al[c] || "left"),
    ...(cols ? (c ? {"data-tpart": c - 1} : {}) : r >= 0 ? {"data-tpart": r} : {})}, slideText({title: words}));
  const row = (cells, tag, r) => el("tr", {}, ...cells.map((w, c) => cell(tag, w, r, c)));
  const w = tableCells(t.title).length;
  const pad = cells => [...cells, ...Array(Math.max(0, w - cells.length)).fill("")].slice(0, w);
  return el("table", {class: "stable"},
    el("thead", {}, row(pad(tableCells(t.title)), "th", -1)),
    el("tbody", {}, ...t.body.slice(1, n).map((r, i) => row(pad(tableCells(r)), "td", i))));
}
