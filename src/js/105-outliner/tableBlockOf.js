/* Rows of cells as one line holding a Markdown table (#469): the header on
   the bullet, the | --- | line and the rows under it, a | in a cell as \|. */
function tableBlockOf(rows) {
  const w = rows[0].length;
  const line = r => tableRowText(r.map(c => String(c).replace(/\s+/g, " ").replace(/(?<!\\)\|/g, "\\|")), w);
  const b = newBlock({title: line(rows[0])});
  b.body = [tableRowText(Array(w).fill("---")), ...rows.slice(1).map(line)];
  return b;
}
