async function setUnconfirmed(rec, set) {
  try { await IDB.set("kv", unconfirmedKey(rec), Array.from(set)); } catch (_) {}
}
