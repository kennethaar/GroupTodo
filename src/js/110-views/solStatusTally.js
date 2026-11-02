// Projects sorted in the status pass, by the status they were given.
function solStatusTally() {
  const tally = {};
  for (const [key, ans] of SOL_ANS) {
    if (!ans.p0 || key[0] === "@") continue;
    const at = key.indexOf("|"), path = key.slice(at + 1);
    const code = inSpace(key.slice(0, at), () => projectHold(path)) ? "hold" : statusDirOf(path);
    if (code) tally[code] = (tally[code] || 0) + 1;
  }
  return tally;
}
