function calTargets(b, also) {
  const own = calOwnShare(b);
  if (!own) return also;
  return own === "-" ? [] : own.split(",").map(trim).filter(Boolean);
}
