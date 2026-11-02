/* What one entry measures. Weight with reps gives the weight, the volume
   (weight × all the reps) and an estimated one-rep max (Epley: weight ×
   (1 + best set's reps / 30)), which rises with either more weight or more reps. */
function trackerMeasures(t) {
  const slots = trackerSlots(t);
  const out = {};
  if (wholeLineTracker(t.code)) {
    const v = lineValue(t.code, t.raw, t.date);
    if (t.code === "t" && (v.value || v.open)) out.hours = Math.round(v.value / 60 * 100) / 100;
    if (t.code === "a" && t.raw) out.amount = v.value;
    if (t.code === "q" && t.raw) out.stock = v.value;
    // A count is a number, so going between _n and _i keeps one line on the chart.
    if (t.code === "i" && t.raw) out.number = tapCount(t.raw);
    return out;
  }
  let kg = null; const reps = [];
  slots.forEach((L, i) => {
    const v = t.values[i], x = trackerNum(v);
    if (L === "c") out.done = TRACKER_DONE_RE.test(trim(v || "")) ? 1 : 0;
    if (x == null) return;
    if (L === "k" && kg == null) kg = x;
    else if (L === "r") reps.push(x);
    else if (L === "n") out.number = (out.number || 0) + x;
    else if (L === "m") out.minutes = (out.minutes || 0) + x;
    else if (L === "s") out.rating = x;
  });
  if (reps.length) { out.reps = reps.reduce((a, b) => a + b, 0); out.best = Math.max(...reps); }
  if (kg != null) {
    out.weight = kg;
    if (reps.length) { out.volume = kg * out.reps; out.max = Math.round(kg * (1 + out.best / 30) * 10) / 10; }
  }
  return out;
}
