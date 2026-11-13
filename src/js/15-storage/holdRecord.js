function holdRecord(record, reason, seen, key = "pagecount:" + record.name) {
  const had = Number(PREF.get(key, "0")) || 0;
  record.hold = {reason, had, seen, at: nowStamp()};
}
