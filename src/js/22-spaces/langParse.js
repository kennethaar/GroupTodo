/* {props, pairs}: pairs is English -> translation, "" where not translated yet. */
function langParse(text) {
  const props = {}, pairs = new Map();
  let head = true;
  for (const raw of String(text || "").split(/\r?\n/)) {
    const line = raw.replace(/\s+$/, "");
    if (!trim(line)) continue;
    if (head) {
      const m = /^([A-Za-z][\w-]*):: ?(.*)$/.exec(line);
      if (m) { props[m[1].toLowerCase()] = trim(m[2]); continue; }
      head = false;
    }
    if (/^\s*(#|<!--)/.test(line)) continue;
    const at = line.indexOf(" =>");
    const key = trim(at < 0 ? line : line.slice(0, at));
    if (key) pairs.set(key, at < 0 ? "" : trim(line.slice(at + 3)));
  }
  return {props, pairs};
}
