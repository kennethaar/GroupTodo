function trackerSuggestRows(q) {
  q = String(q || "").toLowerCase();
  const rows = trackerList().filter(g => !q || g.name.includes(q) || g.key.toLowerCase().slice(8).startsWith(q))
    .slice(0, 8).map(g => ({accept: "tracker", key: g.key, title: trackerTitle(g.name),
      detail: trackerKindWords(g.code), mark: "↗"}));
  rows.push({accept: "wizard", title: "Set up a new tracker…", detail: "step by step", mark: "+"});
  return rows;
}
