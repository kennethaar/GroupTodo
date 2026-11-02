// Every line of both lists; one only in second goes in after the line it followed there.
function unionBlocks(first, second) {
  const out = first.slice();
  let after = -1;
  for (const b of second) {
    const at = out.findIndex(x => sameLine(x, b));
    if (at >= 0) { foldLine(out[at], b); after = at; continue; }
    out.splice(++after, 0, b);
  }
  return out;
}
