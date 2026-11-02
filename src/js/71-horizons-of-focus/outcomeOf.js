function outcomeOf(path) {
  const page = getPage(path); if (!page) return null;
  const prop = trim(page.props?.outcome || "");
  if (prop && !OUTCOME_PLACEHOLDER.test(prop)) return prop;
  // older pages wrote it as a leading "Outcome: ..." block
  for (const b of page.blocks || []) {
    const m = /^outcome:\s*(.+)$/i.exec(trim(b.title));
    if (m && !OUTCOME_PLACEHOLDER.test(m[1])) return trim(m[1]);
  }
  return null;
}
