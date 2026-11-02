function holdValue(v) {
  const day = dateIn(v || "");
  if (day) return day;
  return /^\s*open\s*$/i.test(String(v || "")) ? HOLD_OPEN : null;
}
