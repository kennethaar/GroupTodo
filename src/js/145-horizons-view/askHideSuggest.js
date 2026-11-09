/* Words in the hidden prompt that look like names it did not know: a word in
   capitals, or a capital in the middle of a sentence. Offered, never hidden
   on a guess; the most frequent first. */
function askHideSuggest(text, max = 8) {
  const seen = new Map();
  const listed = new Set(askHideNames().map(n => n.toLowerCase()));
  for (const m of String(text || "").matchAll(/(?<![\p{L}\p{N}[])\p{Lu}[\p{L}\p{N}&]*(?:[-.][\p{L}\p{N}]+)*/gu)) {
    const w = m[0], before = text.slice(Math.max(0, m.index - 3), m.index);
    const caps = w.length >= 2 && w === w.toUpperCase() && /\p{L}{2}/u.test(w);
    const starts = m.index === 0 || /(?:^|\n|[.!?:]\s|- |\] |" |\n\s*)$/.test(before) || /\n\s*$/.test(before);
    if (ASK_HIDE_PLAIN.has(w) || listed.has(w.toLowerCase()) || w.length < 2 || (!caps && starts)) continue;
    seen.set(w, (seen.get(w) || 0) + 1);
  }
  return [...seen].sort((a, b) => b[1] - a[1]).slice(0, max).map(([w]) => w);
}
