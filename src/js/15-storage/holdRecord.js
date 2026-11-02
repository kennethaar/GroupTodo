function holdRecord(record, reason, seen) {
  const had = Number(PREF.get("pagecount:" + record.name, "0")) || 0;
  record.hold = {reason, had, seen, at: nowStamp()};
}
