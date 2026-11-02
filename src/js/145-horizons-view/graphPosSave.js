function graphPosSave() {
  try {
    const round = v => Math.round(v * 10) / 10;
    localStorage.setItem(GRAPH_POS_KEY, JSON.stringify([...GRAPH_POS].map(([k, p]) => [k, {x: round(p.x), y: round(p.y)}])));
  } catch (_) {}
}
