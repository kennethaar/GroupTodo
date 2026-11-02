function trackerColours(names) {
  const out = new Map(names.map(n => [n, trackerOwnColour(n)]));
  const free = Object.keys(TRACKER_COLOURS).filter(c => ![...out.values()].includes(c));
  for (const n of names) if (!out.get(n)) out.set(n, free.shift() || "teal");
  return out;
}
