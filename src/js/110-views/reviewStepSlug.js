function reviewStepSlug(text) {
  const words = trackerSlug(text).split("-").filter(Boolean);
  let out = "";
  for (const w of words) { if (out && (out + "-" + w).length > 28) break; out = out ? out + "-" + w : w; }
  return REVIEW_TRACKER_PREFIX + (out || "step");
}
