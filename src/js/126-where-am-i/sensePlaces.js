function sensePlaces() {
  try {
    const list = JSON.parse(PREF.get("sense.places", "[]"));
    return Array.isArray(list) ? list.filter(p => p && p.ctx && isFinite(p.lat) && isFinite(p.lon)) : [];
  } catch (_) { return []; }
}
