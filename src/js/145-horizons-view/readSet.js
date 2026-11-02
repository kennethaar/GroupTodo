function readSet() {
  return memo("readSet:" + readKey(), () => {
    try { return new Set(JSON.parse(PREF.get(readKey(), "[]"))); }
    catch (_) { return new Set(); }
  });
}
