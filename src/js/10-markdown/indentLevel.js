function indentLevel(ws) {
  let n = 0;
  for (const ch of ws) n += ch === "\t" ? 2 : 1;
  return Math.floor(n / 2);
}
