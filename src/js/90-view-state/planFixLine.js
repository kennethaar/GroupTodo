/* One line of the answer, made to read the way this area writes it. On an
   action line the context comes off and goes back on at the end, as one of
   the area's own: [[-/Contact]] is a cancelled project here, not a context. */
function planFixLine(text, isAction) {
  let t = String(text || ""), ctx = null;
  if (isAction) t = t.replace(/\[\[(-|c)\/([^\]\[]+?)\]\]/g, (m, pfx, name) => {
    if (pfx === "-" && findExistingPage(m.slice(2, -2)) && !contextList().some(c => c.toLowerCase() === trim(name).toLowerCase())) return m;
    if (!ctx) ctx = trim(name);
    return "";
  });
  // A link to nothing that is filed nowhere is an AI wrapping words in [[ ]].
  t = t.replace(/\[\[([^\]\[]+?)\]\]/g, (m, target) => {
    const pre = /^([^/\s]+)\//.exec(target);
    if (/^\d{4}-\d{2}-\d{2}$/.test(target) || (pre && LINK_PREFIXES.has(pre[1])) || findExistingPage(target)) return m;
    return target;
  });
  const names = allPeople().map(personName);
  t = t.replace(/\[\[p\/([^\]\[]+?)\]\]/g, (m, n) => { const hit = names.find(x => samePerson(x, n)); return hit ? "[[p/" + hit + "]]" : m; });
  const bare = names.filter(n => n.includes(" ") && !samePerson(n, whoAmI())).sort((a, b) => b.length - a.length);
  t = t.split(/(\[\[[^\]]*(?:\]\[[^\]]*)?\]\])/).map((seg, i) => i % 2 ? seg : bare.reduce((s, n) =>
    s.replace(new RegExp("(^|[^\\p{L}])(" + planReEsc(n) + ")(?![\\p{L}])", "iu"), (mm, a) => a + "[[p/" + n + "]]"), seg)).join("");
  if (ctx) {
    const ctxs = contextList(), low = ctx.toLowerCase();
    const hit = ctxs.find(c => c.toLowerCase() === low) || ctxs.find(c => c.split("/").pop().toLowerCase() === low);
    t += " [[c/" + (hit || ctx) + "]]";
  }
  return trim(t.replace(/\s{2,}/g, " "));
}
