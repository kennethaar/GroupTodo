function bookPlot(scope = bookScope()) {
  const {chapters, scenes} = bookAnalysis(scope), lines = new Map(), loose = [];
  for (const sc of scenes) {
    const names = namesIn(sceneProp(sc.scene, "plot")).map(nameShown);
    if (!names.length && sc.scene.block) loose.push(sc);
    for (const n of names) {
      const key = n.toLowerCase();
      if (!lines.has(key)) lines.set(key, {name: n, cells: chapters.map(() => [])});
      lines.get(key).cells[sc.chapter].push(sc);
    }
  }
  for (const line of lines.values()) {
    const used = line.cells.map((c, i) => c.length ? i : -1).filter(i => i >= 0);
    line.gaps = new Set();
    used.forEach((at, j) => { const next = used[j + 1]; if (next != null && next - at - 1 >= PLOT_GAP) for (let i = at + 1; i < next; i++) line.gaps.add(i); });
  }
  return {chapters, lines: [...lines.values()], loose};
}
