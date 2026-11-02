function solKbType(ch) {
  const ks = SOL_SPOTS.filter(k => SOL_ACTS.has(k) && !SOL_ACTS.get(k).more);
  const find = w => {
    const by = test => ks.filter(k => test(solActName(SOL_ACTS.get(k))));
    const h = by(n => n.startsWith(w));
    return h.length ? h : by(n => n.split(/[\s\-/]+/).some(x => x.startsWith(w)));
  };
  const c = ch.toLocaleLowerCase(), now = Date.now();
  let s = now - SOL_TA.at < SOL_TA_MS ? SOL_TA.s + c : c;
  let hit = find([...s].every(x => x === s[0]) ? s[0] : s);
  // A letter that does not carry on what was typed starts a new search with itself.
  if (!hit.length && s !== c) { s = c; hit = find(c); }
  SOL_TA = hit.length ? {s, at: now} : {s: "", at: 0};
  if (!hit.length) return false;
  /* "m", "mm", "mmm" step through the m's from the one aimed at; a longer
     name keeps the one aimed at while it still fits. */
  const from = SOL_KB ? hit.indexOf(SOL_KB.k) : -1, step = [...s].every(x => x === s[0]);
  const k = !step && from >= 0 ? hit[from] : hit[from + 1] ?? hit[0];
  return solKbOpen(k);
}
