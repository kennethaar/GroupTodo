/* One per thing tracked, the code and key taken from its latest line. */
function trackerList() {
  return memo("trackerList", () => {
    const by = new Map();
    for (const e of trackerEntries()) {
      if (!by.has(e.name)) by.set(e.name, {name: e.name, entries: []});
      const g = by.get(e.name);
      g.entries.push(e); g.code = e.code; g.key = e.key;
    }
    return [...by.values()].sort((a, b) => a.name.localeCompare(b.name));
  });
}
