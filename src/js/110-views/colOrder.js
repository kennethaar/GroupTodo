function colOrder(by) {
  try { return JSON.parse(PREF.get(colOrderKey(by), "[]")); }
  catch (_) { return []; }
}
