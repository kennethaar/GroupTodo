/* Every day in the log, from every device, and this device's days not written yet. */
function usageRecords() {
  const out = [], seen = new Set();
  const add = (day, device, places) => {
    if (seen.has(day + " " + device)) return;
    seen.add(day + " " + device);
    out.push({day, device, places});
  };
  const home = usageHome();
  if (home) inSpace(home, () => {
    for (const b of getPage(USAGE_PATH)?.blocks || []) {
      const m = USAGE_LINE_RE.exec(trim(b.title || ""));
      if (!m) continue;
      const places = {};
      for (const part of m[3].split(", ")) {
        const p = /^(.+) (\d+)\/([\d.]+)\/(\d+)$/.exec(trim(part));
        if (p) places[p[1]] = [+p[2], parseFloat(p[3]) * 60, +p[4]];
      }
      add(m[1], m[2], places);
    }
  });
  const device = usageDevice();
  for (const [day, places] of Object.entries(usageDays())) add(day, device, places);
  return out;
}
