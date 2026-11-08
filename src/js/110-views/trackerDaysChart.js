/* Several trackers on one scale. Hovering a day says each one's value and
   the total; clicking it opens that day. With more than one, each is named
   at its end, so colour is never the only clue. A signed chart (#210) keeps
   values below 0, on a scale with 0 in the middle. */
function trackerDaysChart(series, days, style, measure, openDay, signed = false) {
  const many = series.length > 1, stacked = many && style === "stacked-bar";
  const W = 600, H = 170, L = 40, R = many ? 110 : 12, T = 12, B = 24;
  const val = (s, d) => { const v = s.by.get(d)?.v; return v == null ? null : signed ? v : Math.max(0, v); };
  const sum = d => series.reduce((n, s) => n + (val(s, d) || 0), 0);
  const hi = niceTop(Math.max(1, ...days.map(d => stacked ? sum(d) : Math.max(0, ...series.map(s => Math.abs(val(s, d) || 0))))));
  const lo = signed ? -hi : 0;
  const slot = (W - L - R) / days.length, bw = Math.min(30, slot * 0.7);
  const X = i => L + slot * (i + 0.5);
  const Y = v => T + (hi - v) / (hi - lo) * (H - T - B);
  const unit = TRACKER_MEASURES[measure].unit ? " " + TRACKER_MEASURES[measure].unit : "";
  const hex = s => s.colour ? TRACKER_COLOURS[s.colour] : "var(--trkc,var(--accent))";
  const name = s => (s.icon ? s.icon + " " : "") + s.label;
  const f = n => n.toFixed(1);
  let svg = '<svg viewBox="0 0 ' + W + " " + H + '" class="trkchart trkdays" role="img" aria-label="' +
    esc(series.map(s => s.label).join(", ") + ", day by day") + '">';
  for (const v of signed ? [lo, 0, hi] : [0, hi / 2, hi]) svg += '<line x1="' + L + '" x2="' + (W - R) + '" y1="' + f(Y(v)) + '" y2="' + f(Y(v)) + '" class="grid"/>' +
    '<text x="' + (L - 6) + '" y="' + f(Y(v) + 4) + '" text-anchor="end">' + fmtNum(v) + "</text>";
  svg += '<text x="' + L + '" y="' + (H - 6) + '">' + esc(humanDate(days[0])) + "</text>" +
    '<text x="' + (W - R) + '" y="' + (H - 6) + '" text-anchor="end">' + esc(humanDate(days[days.length - 1])) + "</text>";
  if (style === "line") for (const s of series) {
    const pts = days.map((d, i) => val(s, d) == null ? null : [X(i), Y(val(s, d))]).filter(Boolean);
    if (!pts.length) continue;
    svg += '<path d="' + pts.map((q, j) => (j ? "L" : "M") + f(q[0]) + " " + f(q[1])).join(" ") + '" class="sr" style="stroke:' + hex(s) + '"/>' +
      pts.map(q => '<circle cx="' + f(q[0]) + '" cy="' + f(q[1]) + '" r="3.5" class="sp" style="fill:' + hex(s) + '"/>').join("");
  } else days.forEach((d, i) => {
    let base = 0;
    series.forEach((s, k) => {
      const v = val(s, d);
      if (!v) return;
      const w = stacked ? bw : bw / series.length, x = X(i) - bw / 2 + (stacked ? 0 : k * w);
      const top = Y(base + v), h = Y(base) - top;
      svg += '<rect x="' + f(x) + '" y="' + f(top) + '" width="' + f(Math.max(1, w - (stacked ? 0 : 1))) + '" height="' + f(h) +
        '" class="br" style="fill:' + hex(s) + '"/>';
      if (stacked) base += v;
    });
  });
  // Each name at the end of its own line or bar, pushed apart where they would overlap.
  if (many) {
    const lastAt = s => { for (let i = days.length - 1; i >= 0; i--) if (val(s, days[i]) != null) return i; return -1; };
    const li = Math.max(...series.map(lastAt));
    if (li >= 0) {
      let base = 0;
      const tags = series.map(s => {
        const i = style === "line" ? lastAt(s) : li, v = i < 0 ? 0 : val(s, days[i]) || 0;
        const y = stacked ? Y(base + v / 2) : Y(v);
        if (stacked) base += v;
        return {s, y};
      }).sort((a, b) => a.y - b.y);
      for (let k = 1; k < tags.length; k++) tags[k].y = Math.max(tags[k].y, tags[k - 1].y + 14);
      const over = tags.length ? tags[tags.length - 1].y - (H - B) : 0;
      if (over > 0) for (const t of tags) t.y -= over;
      for (const {s, y} of tags) svg += '<circle cx="' + (W - R + 10) + '" cy="' + f(y) + '" r="4" style="fill:' + hex(s) + '"/>' +
        '<text x="' + (W - R + 18) + '" y="' + f(y + 4) + '" class="lbl">' + esc(name(s).slice(0, 16)) + "</text>";
    }
  }
  days.forEach((d, i) => {
    const tip = [humanDate(d), ...series.map(s => name(s) + "  " + fmtNum(val(s, d) || 0) + unit),
      ...(many && !signed ? ["Together  " + fmtNum(sum(d)) + unit] : [])].join("\n");
    svg += '<rect data-i="' + i + '" x="' + f(X(i) - slot / 2) + '" y="' + T + '" width="' + f(slot) + '" height="' + (H - T - B) +
      '" class="hit"><title>' + esc(tip) + "</title></rect>";
  });
  svg += "</svg>";
  const host = el("div", {class: "trkchartbox", html: svg});
  host.addEventListener("click", e => {
    const i = e.target.closest("[data-i]")?.dataset.i;
    if (i == null) return;
    const hit = series.map(s => s.by.get(days[+i])?.e).find(Boolean);
    if (hit) openDay(hit); else go("today", {todayDay: days[+i]});
  });
  return host;
}
