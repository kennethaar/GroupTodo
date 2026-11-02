// What a fetch is checked against: the keys, and each look with its day in front.
function calSkipsOf(path, into) {
  const d = dayOfPath(path);
  calSkips(getPage(path)).forEach(k => into.add(k[0] === "~" ? d + k : k));
  return into;
}
