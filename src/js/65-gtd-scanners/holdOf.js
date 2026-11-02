function holdOf(block) {
  for (let p = block; p; p = p._parent) {
    const day = holdValue(blockProp(p, "hold"));
    if (day) return day;
  }
  return null;
}
