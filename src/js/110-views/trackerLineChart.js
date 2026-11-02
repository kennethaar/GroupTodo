function trackerLineChart(points, measure, openDay) {
  const W = 600, H = 170, L = 40, R = 12, T = 12, B = 24;
  const ms = d => new Date(d + "T12:00:00").getTime();
  const x0 = ms(points[0].date), x1 = ms(points[points.length - 1].date);
  let lo = Math.min(...points.map(p => p.v)), hi = Math.max(...points.map(p => p.v));
  if (measure === "rating") { lo = 0; hi = 10; }
  if (lo === hi) { lo -= 1; hi += 1; }
  const pad = (hi - lo) * 0.1; lo -= measure === "rating" ? 0 : pad; hi += measure === "rating" ? 0 : pad;
  const X = d => points.length === 1 ? (L + W - R) / 2 : L + (ms(d) - x0) / (x1 - x0) * (W - L - R);
  const Y = v => T + (1 - (v - lo) / (hi - lo)) * (H - T - B);
  const unit = TRACKER_MEASURES[measure].unit || "";
  const path = points.map((p, i) => (i ? "L" : "M") + X(p.date).toFixed(1) + " " + Y(p.v).toFixed(1)).join(" ");
  const ticks = [hi - pad, (hi + lo) / 2, lo + pad].map(v => measure === "rating" ? v : v);
  const svg = '<svg viewBox="0 0 ' + W + " " + H + '" class="trkchart" role="img" aria-label="' + esc(TRACKER_MEASURES[measure].label) + ' over time">' +
    ticks.map(v => '<line x1="' + L + '" x2="' + (W - R) + '" y1="' + Y(v).toFixed(1) + '" y2="' + Y(v).toFixed(1) + '" class="grid"/>' +
      '<text x="' + (L - 6) + '" y="' + (Y(v) + 4).toFixed(1) + '" text-anchor="end">' + fmtNum(v) + "</text>").join("") +
    '<text x="' + L + '" y="' + (H - 6) + '">' + esc(humanDate(points[0].date)) + "</text>" +
    (points.length > 1 ? '<text x="' + (W - R) + '" y="' + (H - 6) + '" text-anchor="end">' + esc(humanDate(points[points.length - 1].date)) + "</text>" : "") +
    '<path d="' + path + '" class="ln"/>' +
    points.map((p, i) => '<circle data-i="' + i + '" cx="' + X(p.date).toFixed(1) + '" cy="' + Y(p.v).toFixed(1) + '" r="4" class="pt">' +
      "<title>" + esc(humanDate(p.date) + ": " + fmtNum(p.v) + (unit ? " " + unit : "") + " · " + p.e.raw) + "</title></circle>").join("") +
    "</svg>";
  const host = el("div", {class: "trkchartbox", html: svg});
  host.addEventListener("click", e => {
    const i = e.target.closest("circle")?.dataset.i;
    if (i != null) openDay(points[+i].e);
  });
  return host;
}
