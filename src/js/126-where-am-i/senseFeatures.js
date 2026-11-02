function senseFeatures(now = new Date(), pos = SENSE_POS) {
  let place = "";
  if (pos) {
    const near = sensePlaces().map(p => ({p, m: senseMetres(pos, p)}))
      .filter(x => x.m <= (x.p.r || 150) + Math.min(pos.acc || 0, 150)).sort((x, y) => x.m - y.m)[0];
    // A saved place by name, else a square of about 400 m.
    place = near ? "@" + near.p.ctx : Math.round(pos.lat * 270) + "," + Math.round(pos.lon * 135);
  }
  return {h: +(now.getHours() + now.getMinutes() / 60).toFixed(2), dow: now.getDay(), work: !choreTime(now),
    port: sensePortrait(), net: senseNetwork(), place, dev: senseDevice()};
}
