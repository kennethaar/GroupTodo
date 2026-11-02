function setReviewTick(key, on) {
  const s = reviewTicks();
  if (on) s.add(key); else s.delete(key);
  let day = "";
  try { const t = JSON.parse(PREF.get("review.ticks", "{}") || "{}"); if (t.at === (getSetting("last_review") || "")) day = t.day || ""; } catch (_) {}
  day = day || todayISO();
  PREF.set("review.ticks", JSON.stringify({at: getSetting("last_review") || "", done: [...s], day}));
  writeReviewTrackers(day, s);
  render();
}
