function untilWords(ms) {
  const min = Math.max(0, Math.round(ms / 6e4));
  if (min < 1) return "now";
  if (min < 60) return "in " + min + " min";
  const h = Math.floor(min / 60), r = min % 60;
  return "in " + h + " h" + (r ? " " + r + " min" : "");
}
