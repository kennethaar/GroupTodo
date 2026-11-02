function fmtMinutes(m) {
  if (m == null) return "";
  const h = Math.floor(m / 60), r = m % 60;
  return h && r ? h + " h " + r + " m" : h ? h + " h" : r + " m";
}
