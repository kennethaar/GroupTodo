/* The guess, from what was sensed, so a test can feed it anything. A saved
   place wins. Then a phone off wifi, or away from every place, is out and
   about. Then work hours. Else you are where you usually are on this device. */
function guessContext({device, net, pos, places, here, away, work = null, now = new Date(), learned = null}) {
  if (pos) {
    const slack = Math.min(pos.acc || 0, 150);
    const near = places.map(p => ({p, m: senseMetres(pos, p)}))
      .filter(x => x.m <= (x.p.r || 150) + slack)
      .sort((x, y) => x.m - y.m)[0];
    if (near) return {ctx: near.p.ctx, why: "near the place saved as @" + near.p.ctx};
  }
  if (learned) return {ctx: learned, why: "where you usually are now"};
  if (device === "phone" && away) {
    if (net === "cellular" || net === "none") return {ctx: away, why: net === "none" ? "offline" : "not on wifi"};
    if (pos && places.length) return {ctx: away, why: "away from your places"};
  }
  if (inWorkHours(work, now)) return {ctx: work.ctx, why: "work hours, " + work.from + "\u2013" + work.to};
  return here ? {ctx: here, why: "on this " + (device === "phone" ? "phone" : "PC")} : null;
}
