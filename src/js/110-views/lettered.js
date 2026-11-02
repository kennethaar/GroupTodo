/* The a/b/c of a menu are the rows it actually has, so a value with nowhere to
   go still answers to a for its first row. */
function lettered(rows) {
  return rows.filter(Boolean).map((r, i) => [String.fromCharCode(97 + i), ...r]);
}
