function sdSpaceNow(by) {
  const p = PREF.get(sdK().pref, "");
  return by.has(p) ? p : by.size ? [...by.keys()][0] : null;
}
