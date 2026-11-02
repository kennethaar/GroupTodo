/* [{day, path, items}], oldest day first; items are the lines to reflect on. */
function reflectLog() {
  const today = todayISO(), from = shiftISO(today, 1 - REFLECT_DAYS), me = journalOwner();
  return memo("reflectLog\u0000" + (V.space || "") + "\u0000" + today, () => allPages(p => isJournalPath(p) && journalOwnerOf(p) === me)
    .map(path => {
      const day = baseName(path);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(day) || day < from || day > today) return null;
      const items = [];
      const walk = blocks => {
        for (const b of blocks || []) {
          if (REFLECTION_RE.test(b.title || "")) continue;
          if (bujoKind(b.title, b.state) || (b.children || []).some(k => bujoKind(k.title, k.state) === "feel")) items.push(b);
          else walk(b.children);
        }
      };
      walk(getPage(path).blocks);
      return items.length ? {day, path, items} : null;
    }).filter(Boolean).sort((a, b) => a.day.localeCompare(b.day)));
}
