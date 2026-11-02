function solEdges(n, fill = "var(--bg3)") {
  const out = [];
  for (let i = 1; i <= Math.min(n, SOL_EDGES); i++)
    out.push(`${i * 2}px ${i * 2}px 0 -1px ${fill}`, `${i * 2}px ${i * 2}px 0 0 var(--border2)`);
  return out.join(",");
}
