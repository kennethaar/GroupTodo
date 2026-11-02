/* The stretches on a line in the order written, in minutes since midnight;
   z is null while the clock still runs. at/len are where it is in the line. */
function clockSpans(text) {
  const out = [];
  for (const m of String(text || "").matchAll(SPAN_RE)) {
    if (+m[1] > 23 || +m[2] > 59 || (m[3] != null && (+m[3] > 24 || +m[4] > 59))) continue;
    out.push({a: +m[1] * 60 + +m[2], z: m[3] != null ? +m[3] * 60 + +m[4] : null, at: m.index, len: m[0].length});
  }
  return out;
}
