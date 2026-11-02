function navSnapshot() {
  const snap = {space: (typeof Spaces === "object" && Spaces) ? Spaces.active : null};
  for (const k of NAV_FIELDS) snap[k] = state[k] ?? null;
  snap.branch = FOCUSED && BRANCH_FOCUS.get(FOCUSED.page)
    ? FOCUSED.space + "\u0000" + FOCUSED.path + "\u0000" + BRANCH_FOCUS.get(FOCUSED.page) : null;
  return snap;
}
