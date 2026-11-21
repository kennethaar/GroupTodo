/* One line of comma (or semicolon) separated text, its cells (#469). A
   "quoted cell" keeps its separators and "" is a quote in it. null when a
   quote is left open. */
function splitQuoted(line, sep) {
  const cells = [];
  let cell = "", quoted = false, i = 0;
  for (; i < line.length; i++) {
    const c = line[i];
    if (quoted) {
      if (c === '"' && line[i + 1] === '"') { cell += '"'; i++; }
      else if (c === '"') quoted = false;
      else cell += c;
    } else if (c === '"' && trim(cell) === "") { cell = ""; quoted = true; }
    else if (c === sep) { cells.push(trim(cell)); cell = ""; }
    else cell += c;
  }
  if (quoted) return null;
  cells.push(trim(cell));
  return cells;
}
