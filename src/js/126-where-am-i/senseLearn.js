function senseLearn(kind, value, now = new Date(), f = senseFeatures(now)) {
  const log = senseLog();
  const last = log[log.length - 1];
  // Fiddling is one pick: the last word within two minutes counts.
  if (last && last.k === kind && Math.abs(now.getTime() - last.t) < 2 * 60000) log.pop();
  log.push({k: kind, v: value, t: now.getTime(), f});
  PREF.set("sense.learn", JSON.stringify(log.slice(-SENSE_LOG_MAX)));
}
