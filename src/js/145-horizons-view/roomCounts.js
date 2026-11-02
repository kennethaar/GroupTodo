function roomCounts(s) {
  const out = [];
  if (s.by.due.length) out.push(el("span", {class: "due"}, s.by.due.length + " due"));
  if (s.by.soon.length) out.push(el("span", {}, s.by.soon.length + " soon"));
  if (s.by.fresh.length) out.push(el("span", {}, s.by.fresh.length + " ok"));
  return el("div", {class: "chorecard-n"}, ...out);
}
