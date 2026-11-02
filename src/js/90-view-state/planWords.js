function planWords(text) {
  const set = new Set();
  for (const w of String(text || "").toLocaleLowerCase().match(/[\p{L}\p{N}]+/gu) || [])
    if (w.length >= 4 && !PLAN_STOP.has(w)) set.add(w.slice(0, 6));
  return set;
}
