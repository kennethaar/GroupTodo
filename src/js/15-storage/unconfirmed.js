async function unconfirmed(rec) {
  try { return new Set((await IDB.get("kv", unconfirmedKey(rec))) || []); }
  catch (_) { return new Set(); }
}
