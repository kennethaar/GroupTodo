function fmtSheet(S, v, signed = false) {
  const f = sheetSetting(S, "format") || S.formats[0][0];
  const a = Math.abs(v || 0);
  let s = S.time && f === "h:mm" ? Math.floor(Math.round(a) / 60) + ":" + pad2(Math.round(a) % 60)
    : S.time ? (a / 60).toFixed(2) : f === "0" ? String(Math.round(a)) : a.toFixed(2);
  if (f === "0,00") s = s.replace(".", ",");
  return (v < 0 && +s.replace(/[^\d]/g, "") ? "-" : signed ? "+" : "") + s;
}
