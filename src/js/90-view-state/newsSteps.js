/* The steps of one What's new animation, read from its text (#471). One step
   a line, words after " | ":
     + id classes > parent | words    add a part (classes and parent optional)
     c id +lit -dim                   change its classes
     t id | words    ty id | words    set its words, or type more of them
     s id | css      - id             add style, take it away
     p id            w 300            point and click, wait (ms)
     k Alt+T         k                show a key, hide it
   Lines starting with # are notes. */
function newsSteps(text) {
  const out = [];
  for (const raw of String(text).split("\n")) {
    const line = raw.trim();
    if (!line || line[0] === "#") continue;
    const cut = line.indexOf(" | ");
    const head = (cut < 0 ? line : line.slice(0, cut)).split(/\s+/), words = cut < 0 ? null : line.slice(cut + 3);
    const [op, id, ...rest] = head;
    if (op === "+") {
      const at = rest.indexOf(">");
      out.push(["+", id, (at < 0 ? rest : rest.slice(0, at)).join(" "), words || "", at < 0 ? undefined : rest[at + 1]]);
    } else if (op === "c") out.push(["c", id, rest.join(" ")]);
    else if (op === "w") out.push(["w", +id]);
    else if (op === "k") out.push(["k", id || null]);
    else out.push(words === null ? [op, id] : [op, id, words]);
  }
  return out;
}
