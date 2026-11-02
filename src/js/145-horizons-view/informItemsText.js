function informItemsText(items, named) {
  const t = informWords(), out = [];
  let about = "", n = 0;
  for (const it of items) {
    const head = informHeadOf(it, named);
    if (out.length) out.push("");
    if (head !== about) { if (head) out.push(informHeadText(head, t) + ":"); about = head; }
    out.push(++n + ". " + it.t);
    const word = informWordOf(it, t);
    if (word) out.push(ASK_IND + t.status + " " + word);
    for (const l of String(it.comment || "").split(/\r?\n/).filter(l => trim(l))) out.push(ASK_IND + trim(l));
    for (const c of it.context || []) out.push(ASK_IND + "  ".repeat(c.depth) + "- " + informLineText(c, t));
  }
  return out.join("\n");
}
