function stopClock(raw) {
  const s = clockSpans(raw).find(x => x.z == null);
  return s ? raw.slice(0, s.at) + fmtClock(s.a) + " - " + nowClock() + raw.slice(s.at + s.len) : raw;
}
