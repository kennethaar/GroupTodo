/* The AI's answer with the names back. unknown: tokens the prompt did not
   use, and tokens that lost their brackets, so a wrong name is never saved
   in silence. */
function askUnhide(text, map) {
  const unknown = [];
  const out = String(text || "").replace(/\[([PEOT])\s?(\d+)\]/g, (m, k, d) => {
    const t = "[" + k + d + "]";
    if (map.has(t)) return map.get(t);
    unknown.push(t);
    return m;
  });
  for (const m of out.matchAll(/(?<![\p{L}\p{N}[])([PEOT]\d{1,3})(?![\p{L}\p{N}\]])/gu))
    if (map.has("[" + m[1] + "]")) unknown.push(m[1]);
  return {text: out, unknown};
}
