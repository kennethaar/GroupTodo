function contextList() {
  const set = new Set();
  for (const path of allPages(p => p.startsWith(DIRS.contexts + "/"))) {
    set.add(path.slice(DIRS.contexts.length + 1).replace(/\.md$/i, ""));
  }
  for (const a of leafActions()) if (a.context) set.add(a.context);
  return Array.from(set).sort();
}
