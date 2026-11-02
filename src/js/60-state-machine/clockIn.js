function clockIn(b) {
  if (blockClocks(b).some(c => c.running)) return;
  let lb = logbookOf(b);
  if (!lb) { lb = [":LOGBOOK:", ":END:"]; (b.drawers || (b.drawers = [])).push(lb); }
  const end = lb.findIndex(l => trim(l) === ":END:");
  lb.splice(end < 0 ? lb.length : end, 0, "CLOCK: [" + clockStamp() + "]");
}
