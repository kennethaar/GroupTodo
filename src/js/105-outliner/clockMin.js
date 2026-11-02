function clockMin(s) {
  const c = readClock(s);
  return c ? +c.slice(0, 2) * 60 + +c.slice(3) : null;
}
