function prevValueIndex() {
  return memo("prevValues\u0000" + (V.space || "") + "\u0000" + V.pages.size, () => {
    const by = new Map();      // owner -> key -> [{date, value}] oldest first
    const put = (owner, key, date, value) => {
      if (!trim(value)) return;
      if (!by.has(owner)) by.set(owner, new Map());
      const m = by.get(owner);
      if (!m.has(key)) m.set(key, []);
      m.get(key).push({date, value: trim(value)});
    };
    for (const path of V.pages.keys()) {
      const date = dayOfPath(path);
      if (!date) continue;
      const owner = (journalOwnerOf(path) || "").toLowerCase();
      const page = getPage(path);
      for (const [k, v] of Object.entries(page.props || {})) {
        const t = parseTracker(k + ":: " + v);
        if (t) put(owner, "tracker:" + t.name, date, t.raw);
        else if (isDayValueKey(k)) put(owner, k.toLowerCase(), date, v);
      }
      walkBlocks(page.blocks, b => {
        const t = parseTracker(b.title);
        if (t) put(owner, "tracker:" + t.name, date, t.raw);
        if (isMessage(b)) return;
        for (const [k, v] of Object.entries(b.props || {})) {
          const tp = parseTracker(k + ":: " + v);
          if (tp) put(owner, "tracker:" + tp.name, date, tp.raw);
          else if (isDayValueKey(k)) put(owner, k.toLowerCase(), date, v);
        }
      });
    }
    for (const m of by.values()) for (const list of m.values()) list.sort((a, b) => a.date.localeCompare(b.date));
    return by;
  });
}
