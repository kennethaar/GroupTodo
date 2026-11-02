function setUsageWorth(place, v) {
  const w = usageWorth();
  if (v) w[place] = v; else delete w[place];
  const raw = Object.entries(w).map(([p, x]) => p + "=" + x).join("; ");
  const home = usageHome();
  if (!home) { PREF.set(USAGE_WORTH_KEY, raw); return; }
  inSpace(home, () => {
    const page = getPage(USAGE_PATH) || putPage(USAGE_PATH, usageNewPage());
    if (raw) page.props.worth = raw; else delete page.props.worth;
    touch(USAGE_PATH);
  });
}
