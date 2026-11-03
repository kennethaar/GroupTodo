function bookRelations(from = 0, to = Infinity) {
  const {scenes, isChar} = bookAnalysis(), pairs = new Map(), seen = new Map();
  const pair = (a, b) => {
    const [x, y] = a < b ? [a, b] : [b, a], k = x + "\u0001" + y;
    if (!pairs.has(k)) pairs.set(k, {a: x, b: y, scenes: 0, talk: 0, said: []});
    return pairs.get(k);
  };
  for (const sc of scenes) {
    if (sc.chapter < from || sc.chapter > to) continue;
    const chars = [...sc.present].filter(k => isChar.has(k));
    for (const k of chars) seen.set(k, (seen.get(k) || 0) + 1);
    chars.forEach((a, i) => chars.slice(i + 1).forEach(b => pair(a, b).scenes++));
    for (const x of sc.speeches) if (x.speaker && x.to && isChar.has(x.speaker) && isChar.has(x.to)) pair(x.speaker, x.to).talk++;
  }
  for (const e of castEntries()) {
    if (!e.path || e.type !== "character") continue;
    for (const [k, v] of Object.entries(getPage(e.path)?.props || {})) {
      if (CAST_OWN_PROPS.has(k.toLowerCase())) continue;
      for (const ref of namesIn(v)) {
        const o = castEntryOf(ref);
        if (o && o.key !== e.key && isChar.has(o.key)) { const p = pair(e.key, o.key); if (!p.said.includes(k)) p.said.push(k); }
      }
    }
  }
  return {pairs: [...pairs.values()], seen};
}
