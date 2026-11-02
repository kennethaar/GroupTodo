function usageWorth() {
  const home = usageHome();
  const raw = home ? inSpace(home, () => getPage(USAGE_PATH)?.props?.worth || "") : PREF.get(USAGE_WORTH_KEY, "");
  const out = {};
  for (const part of String(raw).split(";")) {
    const m = /^\s*(.+?)=(\w+)\s*$/.exec(part);
    if (m) out[m[1]] = m[2];
  }
  return out;
}
