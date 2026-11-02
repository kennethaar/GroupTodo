/* Back from a query to the form, when the form can say it; null when it
   cannot, and the query opens as text. */
function qbFromQuery(src) {
  if (!trim(src)) return {mode: "and", rows: []};
  let q;
  try { q = parseQuery(src); } catch (_) { return null; }
  const rowOf = (leaf, not = false) => {
    const r = {kind: "", states: [], a: "", b: "", not};
    switch (leaf.op) {
      case "task": return Object.assign(r, {kind: "task", states: leaf.states});
      case "link": return Object.assign(r, {kind: leaf.tag ? "tag" : "link", a: leaf.ref});
      case "text": return Object.assign(r, {kind: "text", a: leaf.s});
      case "page": return Object.assign(r, {kind: "page", a: leaf.ref});
      case "prop": return Object.assign(r, {kind: "prop", a: leaf.key, b: leaf.value});
      case "pageprop": return Object.assign(r, {kind: "pageprop", a: leaf.key, b: leaf.value});
      case "between": return Object.assign(r, {kind: "between", a: leaf.from, b: leaf.to});
      case "not": return leaf.args.length === 1 && !leaf.args[0].args ? rowOf(leaf.args[0], true) : null;
      default: return null;
    }
  };
  const top = (q.op === "and" || q.op === "or") ? q.args : [q];
  const rows = top.map(a => rowOf(a));
  if (rows.some(r => !r)) return null;
  // The form may spell it differently; that is fine as long as it means the same.
  const again = qbText({mode: q.op === "or" ? "or" : "and", rows});
  if (JSON.stringify(parseQuery(again)) !== JSON.stringify(q)) return null;
  return {mode: q.op === "or" ? "or" : "and", rows};
}
