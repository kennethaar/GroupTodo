function sameLine(a, b) {
  const k = lineKey(a);
  if (!k || k !== lineKey(b)) return false;
  // Two meetings or two linked lines with the same words are still two.
  for (const f of ["id", "cal_uid"]) {
    const x = blockProp(a, f), y = blockProp(b, f);
    if (x && y && x !== y) return false;
  }
  return true;
}
