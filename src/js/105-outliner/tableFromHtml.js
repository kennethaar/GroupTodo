/* The first <table> in copied HTML (#469), read with the browser's own
   parser. Only when the table is nearly all that was copied: a web page
   copied with a table in it is text with a table, not a table. */
function tableFromHtml(html) {
  const doc = new DOMParser().parseFromString(html, "text/html");
  const t = doc.querySelector("table");
  if (!t) return null;
  const size = n => (n?.textContent || "").replace(/\s+/g, "").length;
  if (size(t) < 0.9 * size(doc.body)) return null;
  const rows = [...t.rows].map(r => [...r.cells].map(c => trim(c.textContent.replace(/\s+/g, " "))))
    .filter(r => r.some(c => c !== ""));
  return rows.length >= 2 && Math.max(...rows.map(r => r.length)) >= 2 ? rows : null;
}
