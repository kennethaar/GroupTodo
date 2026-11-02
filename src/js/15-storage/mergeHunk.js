/* A stretch both sides changed, looked at line by line: a base line stays
   only if both kept it, and every line either side added goes in where it
   was added. So one side taking a line out and the other taking out the next
   is two deletes, and a line changed on one side and taken out on the other
   keeps the change. A clash is a line both sides took out and both put
   something else in for: a line both changed. */
function mergeHunk(B, O, T) {
  const mo = lineMatches(B, O), mt = lineMatches(B, T);
  const out = [];
  let o = 0, t = 0, ins = 0, gone = false;
  const put = (a, b) => { if (a.length && b.length && a.join("\n") !== b.join("\n")) ins++; out.push(...unionLines(a, b)); };
  for (let k = 0; k < B.length; k++) {
    const a = mo[k] >= 0 ? O.slice(o, mo[k]) : [], b = mt[k] >= 0 ? T.slice(t, mt[k]) : [];
    if (mo[k] >= 0) o = mo[k] + 1;
    if (mt[k] >= 0) t = mt[k] + 1;
    put(a, b);
    if (mo[k] >= 0 && mt[k] >= 0) out.push(B[k]);
    if (mo[k] < 0 && mt[k] < 0) gone = true;
  }
  put(O.slice(o), T.slice(t));
  return {lines: out, clash: gone && ins > 0};
}
