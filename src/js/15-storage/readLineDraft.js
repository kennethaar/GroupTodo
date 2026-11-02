function readLineDraft() {
  try {
    const d = JSON.parse(localStorage.getItem(DRAFT_KEY) || "null");
    return d && typeof d.text === "string" && d.path ? d : null;
  } catch (_) { return null; }
}
