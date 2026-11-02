/* A minute's number outside the rim, at its place counter-clockwise from the top. */
function dialNumber(m, max) {
  const a = m / max * 2 * Math.PI, r = DIAL_R + 7;
  return `<text class="tnum" x="${(DIAL_C - r * Math.sin(a)).toFixed(2)}" y="${(DIAL_C - r * Math.cos(a)).toFixed(2)}">${m}</text>`;
}
