function linkPagePath(ref) {
  const target = trim(ref).split("][")[0];
  if (/^go\//.test(target)) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(target)) return ensureJournal(target);
  return relResolve(target, V.space)?.path || null;
}
