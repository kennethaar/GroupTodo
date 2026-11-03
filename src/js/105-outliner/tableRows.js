/* How many of a block's body lines belong to its table: the | --- | line and
   the rows after it. 0 when the block is not a table. A task is never one. */
function tableRows(b) {
  const body = b.body || [];
  if (b.state || !TABLE_ROW_RE.test(b.title || "") || !TABLE_SEP_RE.test(body[0] || "")) return 0;
  let n = 1;
  while (n < body.length && TABLE_ROW_RE.test(body[n])) n++;
  return n;
}
