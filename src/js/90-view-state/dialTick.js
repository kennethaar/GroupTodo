/* A tick on the rim at a fraction of the way round, counter-clockwise from the top. */
function dialTick(f, inner) {
  const a = f * 2 * Math.PI, s = -Math.sin(a), c = -Math.cos(a), r1 = DIAL_R - inner, r2 = DIAL_R;
  return `<line x1="${(DIAL_C + r1 * s).toFixed(2)}" y1="${(DIAL_C + r1 * c).toFixed(2)}" x2="${(DIAL_C + r2 * s).toFixed(2)}" y2="${(DIAL_C + r2 * c).toFixed(2)}"/>`;
}
