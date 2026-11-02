function trackerSetsChart(sessions, openDay) {
  const shown = sessions.slice(-30);
  const n = shown.length, sets = Math.max(1, ...shown.map(d => d.reps.length));
  const W = 600, H = 200, L = 34, R = 34, T = 14, B = 24;
  const slot = (W - L - R) / Math.max(n, 1), bw = Math.min(46, slot * 0.62);
  const X = i => L + slot * (i + 0.5);
  const kgHi = Math.max(1, ...shown.map(d => d.kg || 0)) * 1.12;
  const repHi = Math.max(1, ...shown.flatMap(d => d.reps.filter(r => r != null))) * 1.15;
  const Yk = v => T + (1 - v / kgHi) * (H - T - B);
  const Yr = v => T + (1 - v / repHi) * (H - T - B);
  const base = H - B;
  let svg = '<svg viewBox="0 0 ' + W + " " + H + '" class="trkchart trksets" role="img" aria-label="Weight and reps per set, by session">';
  // Scales: kilos on the left, reps on the right.
  for (const f of [0.5, 1]) {
    const kv = kgHi / 1.12 * f, rv = repHi / 1.15 * f;
    svg += '<line x1="' + L + '" x2="' + (W - R) + '" y1="' + Yk(kv).toFixed(1) + '" y2="' + Yk(kv).toFixed(1) + '" class="grid"/>' +
      '<text x="' + (L - 5) + '" y="' + (Yk(kv) + 4).toFixed(1) + '" text-anchor="end">' + fmtNum(Math.round(kv)) + "</text>" +
      '<text x="' + (W - R + 5) + '" y="' + (Yr(rv) + 4).toFixed(1) + '" class="rp">' + fmtNum(Math.round(rv)) + "</text>";
  }
  svg += '<text x="' + (L - 5) + '" y="' + (base + 4) + '" text-anchor="end">kg</text>' +
    '<text x="' + (W - R + 5) + '" y="' + (base + 4) + '" class="rp">reps</text>';
  shown.forEach((d, i) => {
    const tip = "<title>" + esc(humanDate(d.date) + " · " + d.e.raw) + "</title>";
    if (d.kg != null) {
      const y = Yk(d.kg), h = base - y, inside = h >= 18;
      svg += '<rect data-i="' + i + '" x="' + (X(i) - bw / 2).toFixed(1) + '" y="' + y.toFixed(1) + '" width="' + bw.toFixed(1) +
        '" height="' + h.toFixed(1) + '" rx="3" class="bar">' + tip + "</rect>";
      if (bw >= 14) svg += '<text x="' + X(i).toFixed(1) + '" y="' + (inside ? base - 6 : y - 4).toFixed(1) +
        '" text-anchor="middle" class="kg' + (inside ? " in" : "") + '">' + fmtNum(d.kg) + "</text>";
    } else svg += '<rect data-i="' + i + '" x="' + (X(i) - bw / 2).toFixed(1) + '" y="' + T + '" width="' + bw.toFixed(1) +
      '" height="' + (base - T) + '" class="hit">' + tip + "</rect>";
  });
  for (let k = 0; k < sets; k++) {
    const pts = shown.map((d, i) => d.reps[k] != null ? [X(i), Yr(d.reps[k]), i, d.reps[k]] : null).filter(Boolean);
    if (!pts.length) continue;
    svg += '<path d="' + pts.map((q, j) => (j ? "L" : "M") + q[0].toFixed(1) + " " + q[1].toFixed(1)).join(" ") + '" class="sl s' + (k % 5) + '"/>';
    svg += pts.map(q => '<circle data-i="' + q[2] + '" cx="' + q[0].toFixed(1) + '" cy="' + q[1].toFixed(1) + '" r="4" class="sp s' + (k % 5) + '">' +
      "<title>" + esc(humanDate(shown[q[2]].date) + " · set " + (k + 1) + ": " + fmtNum(q[3]) + " reps") + "</title></circle>").join("");
  }
  if (n) svg += '<text x="' + L + '" y="' + (H - 6) + '">' + esc(humanDate(shown[0].date)) + "</text>" +
    (n > 1 ? '<text x="' + (W - R) + '" y="' + (H - 6) + '" text-anchor="end">' + esc(humanDate(shown[n - 1].date)) + "</text>" : "");
  svg += "</svg>";
  const host = el("div", {class: "trkchartbox", html: svg});
  host.addEventListener("click", e => {
    const i = e.target.closest("[data-i]")?.dataset.i;
    if (i != null) openDay(shown[+i].e);
  });
  const legend = el("div", {class: "trklegend"}, el("span", {}, el("i", {class: "kgkey"}), "kg"),
    ...Array.from({length: sets}, (_, k) => el("span", {}, el("i", {class: "s" + (k % 5)}), "set " + (k + 1))));
  return el("div", {}, host, legend,
    sessions.length > n ? el("div", {class: "hint"}, "The last " + n + " of " + sessions.length + " sessions.") : null);
}
