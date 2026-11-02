/* "7.5", "7,5" and "7:30" are the same seven and a half hours; a sheet of
   hours keeps minutes, the others the number. */
function sheetNum(S, s) {
  const t = trim(String(s || ""));
  const c = /^(\d{1,2}):(\d{2})$/.exec(t);
  if (c) return S.time ? +c[1] * 60 + +c[2] : +c[1] + +c[2] / 60;
  const x = numIn(t);
  return x == null ? 0 : S.time ? Math.round(x * 60) : x;
}
