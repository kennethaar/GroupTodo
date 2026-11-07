/* Next is for doing, so it reads by where you are: one header per context,
   said once, with its count, and the rows under it (#315). The list comes
   sorted, so a group stands where its most urgent row would. The Journal is
   for capture and never groups. A header is a button: it shows that context
   alone. */
function contextGroupedCard(list, emptyText, rowOpts = {}) {
  const at = new Map();
  list.forEach(a => { if (!at.has(a.context || "")) at.set(a.context || "", at.size); });
  if (at.size < 2) return taskCard(list, emptyText, Object.assign({grouped: at.size === 1 && list.length > 0}, rowOpts));
  const n = new Map([...at.keys()].map(k => [k, list.filter(a => (a.context || "") === k).length]));
  const sorted = list.map((a, i) => [a, i]).sort((x, y) => at.get(x[0].context || "") - at.get(y[0].context || "") || x[1] - y[1]).map(x => x[0]);
  const opts = Object.assign({grouped: true}, rowOpts);
  return pagedCard(sorted, (a, i) => {
    const row = taskRow(a, opts), k = a.context || "";
    if (i && (sorted[i - 1].context || "") === k) return row;
    const head = el("button", {type: "button", class: "jgroup ngroup", title: "Show only " + (k ? "@" + k : "actions with no context"),
      onclick: () => go("next", {ctxFilter: k || CTX_NONE})},
      k ? el("span", {class: "ngname"}, contextLabel(k)) : el("span", {class: "none"}, "No context"),
      el("span", {class: "n"}, String(n.get(k))));
    const both = document.createDocumentFragment();
    both.append(head, row);
    return both;
  }, emptyText);
}
