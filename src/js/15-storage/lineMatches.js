/* For each line of a, the index of the same line in b, or -1: the longest run
   the two have in common, in order. Common ends are cut off first, so the
   usual edit -- a few lines in a page -- leaves a small table to fill. */
function lineMatches(a, b) {
  const ma = new Array(a.length).fill(-1);
  let s = 0, ea = a.length, eb = b.length;
  while (s < ea && s < eb && a[s] === b[s]) { ma[s] = s; s++; }
  while (ea > s && eb > s && a[ea - 1] === b[eb - 1]) { ea--; eb--; ma[ea] = eb; }
  const n = ea - s, m = eb - s;
  if (!n || !m || n * m > 1e7) return ma;
  const w = m + 1, L = new Uint16Array((n + 1) * w);
  for (let i = n - 1; i >= 0; i--)
    for (let j = m - 1; j >= 0; j--)
      L[i * w + j] = a[s + i] === b[s + j] ? L[(i + 1) * w + j + 1] + 1
                   : Math.max(L[(i + 1) * w + j], L[i * w + j + 1]);
  for (let i = 0, j = 0; i < n && j < m;) {
    if (a[s + i] === b[s + j]) { ma[s + i] = s + j; i++; j++; }
    else if (L[(i + 1) * w + j] >= L[i * w + j + 1]) i++;
    else j++;
  }
  return ma;
}
