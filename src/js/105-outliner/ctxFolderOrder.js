function ctxFolderOrder(names) {
  const folders = new Set(names.filter(n => n.includes("/")).map(ctxTop));
  const inFolder = n => folders.has(ctxTop(n));
  return [...names.filter(n => !inFolder(n)),
    ...names.filter(inFolder).sort((a, b) => ctxTop(a).localeCompare(ctxTop(b)) ||
      (a === ctxTop(a) ? -1 : b === ctxTop(b) ? 1 : a.localeCompare(b)))];
}
