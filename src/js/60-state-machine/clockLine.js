function clockLine(c) {
  if (!c.end) return "CLOCK: [" + clockStamp(c.start) + "]";
  const s = Math.max(0, Math.round((c.end - c.start) / 1000));
  return "CLOCK: [" + clockStamp(c.start) + "]--[" + clockStamp(c.end) + "] =>  " +
    pad2(Math.floor(s / 3600)) + ":" + pad2(Math.floor(s / 60) % 60) + ":" + pad2(s % 60);
}
