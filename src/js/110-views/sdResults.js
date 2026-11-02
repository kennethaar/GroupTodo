function sdResults(space) {
  const raw = inSpace(space, () => getSetting(sdK().setting)) || "";
  return String(raw).split("|").map(s => /^\s*(.+?) > (.+?) (\d{4}-\d{2}-\d{2})\s*$/.exec(s))
    .filter(Boolean).map(m => ({w: m[1], l: m[2], at: m[3]}));
}
