function dedupClash(a, b) {
  return DEDUP_IDENTITY.some(k => {
    const x = trim(blockProp(a, k) || ""), y = trim(blockProp(b, k) || "");
    return x && y && x !== y;
  });
}
