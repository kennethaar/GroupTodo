/* Picked first, then what is now, then what this project is most connected to. */
function solRanked(r, f, rest, isOn, isNow = () => false) {
  const score = f.rank ? f.rank(r) : new Map();
  const scoreOf = v => score.get(v) ?? score.get(String(v).toLowerCase()) ?? 0;
  return rest.map((o, i) => ({o, i, on: isOn(o[0]) ? 1 : 0, now: isNow(o[0]) ? 1 : 0, s: scoreOf(o[0])}))
    .sort((a, b) => (b.on - a.on) || (b.now - a.now) || (b.s - a.s) || (a.i - b.i)).map(x => x.o);
}
