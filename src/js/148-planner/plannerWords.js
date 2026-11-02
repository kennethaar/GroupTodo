/* Planner shows text as it is written, so a line goes there as words:
   [[c/PC]] is PC, [[1/Fix sink]] is Fix sink, #urgent is urgent, a person is
   plannerPerson(), ((id)) is the line it points at, and bold, italics, code
   and the like keep only their words. */
function plannerWords(text) {
  let t = withoutEst(String(text || ""));
  t = t.replace(/\{\{\s*(embed|query)\b[\s\S]*?\}\}/gi, "");
  t = t.replace(/\(\(([A-Za-z0-9_-]{4,64})\)\)/g, (all, id) => {
    const hit = blockById(id);
    return hit ? plannerWords(String(hit.block.title || "").replace(/\(\([A-Za-z0-9_-]{4,64}\)\)/g, "")) : "";
  });
  t = t.replace(/!\[([^\]]*)\]\([^)\s]+\)/g, "$1");
  t = t.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (all, label, href) => /^https?:/.test(href) ? label + " (" + href + ")" : label);
  t = t.replace(/#?\[\[([^\]]+)\](?:\[([^\]]*)\])?\]/g, (all, target, label) => {
    target = trim(target.split("|")[0].split("#")[0]);
    const pfx = (/^([^/]+)\//.exec(target) || [])[1];
    if (pfx === "p") return plannerPerson(target.slice(2));
    if (label && trim(label)) return trim(label);
    if (pfx === "go") return tourLabel(target.slice(3));
    const known = ["c", "o", "z", "a", "g", "8", "_"].includes(pfx) || (pfx && STATUS_DIRS[pfx]);
    return known ? target.slice(pfx.length + 1) : target;
  });
  t = t.replace(/(^|[\s(])#([\p{L}\p{N}_\-/]+)/gu, "$1$2");
  t = t.replace(/\*\*(.+?)\*\*|__(.+?)__|~~(.+?)~~|==(.+?)==/g, (all, a, b, c, d) => a ?? b ?? c ?? d);
  t = t.replace(/(^|[^\w*])\*([^*\s][^*]*?)\*(?!\w)/g, "$1$2").replace(/(^|[^\w_])_([^_\s][^_]*?)_(?!\w)/g, "$1$2");
  t = t.replace(/`([^`]+)`/g, "$1");
  return trim(t.replace(/\s+/g, " ").replace(/\s+([,.;:!?)])/g, "$1"));
}
