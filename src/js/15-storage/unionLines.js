// Every line of a and of b, the shared ones once, a's first where they differ.
function unionLines(a, b) {
  const ma = lineMatches(a, b), out = [];
  let j = 0;
  for (let i = 0; i < a.length; i++) {
    if (ma[i] >= 0) { while (j < ma[i]) out.push(b[j++]); j++; }
    out.push(a[i]);
  }
  while (j < b.length) out.push(b[j++]);
  return out;
}
