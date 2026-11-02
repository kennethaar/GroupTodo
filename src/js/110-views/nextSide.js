function nextSide(now = new Date()) {
  try {
    const p = JSON.parse(PREF.get("next.side", "{}"));
    if (p.slot === choreSlot(now) && (p.side === "todo" || p.side === "chores")) return p.side;
  } catch (_) {}
  const l = senseLearned("side", now);
  return l ? l.v : choreTime(now) ? "chores" : "todo";
}
