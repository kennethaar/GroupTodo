function actStillTally() {
  const t = {};
  for (const [k, a] of SOL_ANS) if (k[0] === "@" && a.still) t[a.still] = (t[a.still] || 0) + 1;
  return t;
}
