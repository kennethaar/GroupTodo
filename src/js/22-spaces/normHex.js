/* Accepts #abc, #aabbcc or a bare aabbcc; anything else is not a colour. */
function normHex(c) {
  let v = trim(c).toLowerCase();
  if (!v) return null;
  if (v[0] !== "#") v = "#" + v;
  if (!/^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/.test(v)) return null;
  if (v.length === 4) v = "#" + v[1] + v[1] + v[2] + v[2] + v[3] + v[3];
  return v;
}
