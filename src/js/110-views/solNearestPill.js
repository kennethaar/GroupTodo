function solNearestPill(box, x, y) {
  let best = null, bd = Infinity;
  for (const p of solPills(box)) { const d = solDist(p.getBoundingClientRect(), x, y); if (d < bd) { bd = d; best = p; } }
  return best;
}
