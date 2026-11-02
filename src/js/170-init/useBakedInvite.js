async function useBakedInvite() {
  const baked = bakedInvite();
  if (!baked) return false;
  if (PREF.get("baked:" + baked.cfg.space, "")) return false;   // already joined
  // Marked spent only by the answer, so "Not now" can be a misclick rather
  // than a decision nobody can undo.
  if (!await openInviteArrived(baked.cfg, baked.vault)) return false;
  PREF.set("baked:" + baked.cfg.space, todayISO());
  return true;
}
