async function handleHash() {
  const h = location.hash;
  if (h === LAST_HASH) return;
  LAST_HASH = h;
  const link = parseDeepLink(h);
  if (!link) return;
  await followDeepLink(link);
}
