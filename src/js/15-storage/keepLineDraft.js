function keepLineDraft(space, path, b, text) {
  try {
    const old = JSON.parse(localStorage.getItem(DRAFT_KEY) || "null");
    // The text the line had before this edit began, kept from the first keystroke.
    const base = old && old.id === b.id && old.path === path ? old.base : b.title;
    if (text === base) { localStorage.removeItem(DRAFT_KEY); return; }
    localStorage.setItem(DRAFT_KEY, JSON.stringify(
      {space: space || V.space, path, id: b.id, base, text, at: nowStamp()}));
  } catch (_) {}
}
