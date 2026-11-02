// How alike two moments are: 1 is the same hour, day and setting.
function senseLike(a, b) {
  let dh = Math.abs(a.h - b.h); dh = Math.min(dh, 24 - dh);
  let w = Math.exp(-dh * dh / 8);
  const off = d => d === 0 || d === 6;
  w *= a.dow === b.dow ? 1.5 : off(a.dow) === off(b.dow) ? 1 : 0.25;
  w *= a.work === b.work ? 1 : 0.4;
  if (a.place && b.place) w *= a.place === b.place ? 3 : 0.3;
  if (a.net && b.net) w *= a.net === b.net ? 1.2 : 0.6;
  w *= a.port === b.port ? 1 : 0.7;
  w *= a.dev === b.dev ? 1 : 0.3;
  return w;
}
