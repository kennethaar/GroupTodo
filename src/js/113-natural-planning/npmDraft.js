function npmDraft(space, path) {
  let mine = null;
  try { mine = JSON.parse(PREF.get(npmKey(space, path), "") || "null"); } catch (_) {}
  if (!mine || mine.path !== path || !Array.isArray(mine.ideas)) mine = null;
  const text = LOADED.get(space || V.space)?.drafts?.get(npmDraftPath(path));
  const file = text ? npmDraftRead(text) : null;
  // Whichever was saved last: the file is what another computer, or another person, left.
  if (file && (!mine || String(file.at || "") > String(mine.at || ""))) return Object.assign(file, {space: space || file.space});
  return mine;
}
