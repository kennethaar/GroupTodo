async function markUnconfirmed(rec, paths) {
  if (mirrorMode(rec) !== "full" || !paths.length) return;
  const open = await unconfirmed(rec);
  paths.forEach(p => open.add(p));
  await setUnconfirmed(rec, open);
}
