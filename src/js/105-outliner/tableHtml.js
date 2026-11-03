/* The table as it is drawn when nobody is writing in it. Each cell knows its
   line (data-bi, -1 the header) so a click opens that row. The | --- | line
   says how each column lines up. */
function tableHtml(b) {
  const n = tableRows(b), head = tableCells(b.title);
  const align = tableCells(b.body[0]).map(c => /^:-+:$/.test(c) ? "center" : /-:$/.test(c) ? "right" : /^:/.test(c) ? "left" : "");
  const cell = (tag, c, j, bi) => `<${tag} data-bi="${bi}"${align[j] ? ` style="text-align:${align[j]}"` : ""}>${renderInline(c.replace(/\\\|/g, "|"))}</${tag}>`;
  const row = (tag, cells, bi) => "<tr>" + head.map((_, j) => cell(tag, cells[j] || "", j, bi)).join("") + "</tr>";
  let rows = "";
  for (let i = 1; i < n; i++) rows += row("td", tableCells(b.body[i]), i);
  return `<table class="mdtable"><thead>${row("th", head, -1)}</thead><tbody>${rows}</tbody></table>`;
}
