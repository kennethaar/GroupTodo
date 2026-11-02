function senseWork() {
  try { return Object.assign({}, SENSE_WORK, JSON.parse(PREF.get("sense.work", "{}"))); }
  catch (_) { return Object.assign({}, SENSE_WORK); }
}
