/* Ticks are about this week's run, on this device, so they are not written
   into a folder colleagues share. Marking the review done starts them over. */
function reviewTicks() {
  try {
    const t = JSON.parse(PREF.get("review.ticks", "{}") || "{}");
    return t.at === (getSetting("last_review") || "") ? new Set(t.done || []) : new Set();
  } catch (_) { return new Set(); }
}
