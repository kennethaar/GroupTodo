// Planner wants a GUID for each checklist item; the same step always gets the same one.
function plannerGuid(s) {
  const x = [1, 2, 3, 4].map(n => plannerHash(s, 0x811c9dc5 ^ n)).join("");
  return x.slice(0, 8) + "-" + x.slice(8, 12) + "-4" + x.slice(13, 16) + "-a" + x.slice(17, 20) + "-" + x.slice(20, 32);
}
