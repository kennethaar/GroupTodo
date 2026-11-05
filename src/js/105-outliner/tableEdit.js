/* One table command on a block's table (see tableCan), the file's lines kept
   valid: the header first, the | --- | line second, every row as wide as the
   header. Returns where the caret goes, the line bi and the offset in it. */
function tableEdit(b, cmd, bi, col) {
  const n = tableRows(b);
  if (!n || !tableCan(b, bi, col).includes(cmd)) return null;
  const all = [b.title, ...b.body.slice(0, n)], rest = b.body.slice(n);
  const L = bi + 1;
  let at = L, c = col;
  if (cmd.startsWith("row-")) {
    if (cmd === "row-above") all.splice(L, 0, tableRowText([], tableCells(b.title).length));
    else if (cmd === "row-below") { at = L === 0 ? 2 : L + 1; all.splice(at, 0, tableRowText([], tableCells(b.title).length)); }
    else if (cmd === "row-up") { [all[L - 1], all[L]] = [all[L], all[L - 1]]; at = L - 1; }
    else if (cmd === "row-down") { [all[L + 1], all[L]] = [all[L], all[L + 1]]; at = L + 1; }
    else { all.splice(L, 1); at = Math.min(L, all.length - 1); if (at < 2) at = 0; }
    b.title = all[0];
    b.body = [...all.slice(1), ...rest];
    return {bi: at - 1, at: tableCellAt(all[at], c)};
  }
  const w = tableCells(b.title).length;
  const cells = all.map((line, k) => {
    const r = tableCells(line);
    while (r.length < w) r.push(k === 1 ? "---" : "");
    return r;
  });
  if (cmd === "col-left" || cmd === "col-right") {
    c = cmd === "col-left" ? col : col + 1;
    cells.forEach((r, k) => r.splice(c, 0, k === 1 ? "---" : ""));
  } else if (cmd === "col-mvleft" || cmd === "col-mvright") {
    c = cmd === "col-mvleft" ? col - 1 : col + 1;
    cells.forEach(r => { [r[c], r[col]] = [r[col], r[c]]; });
  } else if (cmd === "col-del") {
    cells.forEach(r => r.splice(col, 1));
    c = Math.min(col, w - 2);
  } else {
    cells[1][col] = {left: "---", center: ":---:", right: "---:"}[cmd.slice(3)];
  }
  cells[1] = cells[1].map(x => ({center: ":---:", right: "---:"}[tableAlign(x)] || "---"));
  const out = cells.map(r => tableRowText(r));
  b.title = out[0];
  b.body = [...out.slice(1), ...rest];
  return {bi, at: tableCellAt(out[L], c)};
}
