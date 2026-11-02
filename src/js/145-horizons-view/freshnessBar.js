/* A bar that fills over one round and turns red past it. */
function freshnessBar(a) {
  const f = freshnessOf(a);
  if (!f) return null;
  const pct = Math.round(f.rounds * 100);
  const cls = f.rounds >= 1.5 ? "late" : f.rounds >= 1 ? "today" : "";
  return el("span", {class: ["chip", "when", "fresh", cls].join(" "),
    title: pct + "% of the way round: repeats every " + f.span + " day(s), and 100% is its day"},
    el("span", {class: "freshbar"}, el("i", {style: "width:" + Math.min(100, pct) + "%"})), pct + "%");
}
