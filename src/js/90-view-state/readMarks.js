/* @phone, #rollup and @mia typed out rather than picked from the list, read
   the same in the capture box and on a task line in the outline (#396).
   Only a symbol is a command: no plain word is cut out of the sentence.
   Returns the line with links in, and the person @ handed it to, if any. */
function readMarks(text) {
  let who = null;
  // @@phone still means the context, the way it was written before @ did.
  text = text.replace(/(^|\s)@@([\p{L}\p{N}_-]+(?:\/[\p{L}\p{N}_-]+)*)/gu, (m, sp, c) => sp + "[[c/" + ctxSlug(c) + "]]");
  /* A room's own name finds it in its folder: @kitchen is home/kitchen when
     that is the only kitchen. */
  const known = w => {
    const all = contextList(), lw = w.toLowerCase();
    const exact = all.find(c => c.toLowerCase() === lw) || contextByAlias(lw);
    if (exact || lw.includes("/")) return exact;
    const inFolder = all.filter(c => c.toLowerCase().endsWith("/" + lw));
    return inFolder.length === 1 ? inFolder[0] : undefined;
  };
  text = text.replace(/(^|\s)#([\p{L}\p{N}_-]+)/gu, (m, sp, q) => {
    const hit = nameIndex().find(n => n.kind === "project" && n.title.toLowerCase().includes(q.toLowerCase()));
    return hit ? sp + "[[" + hit.ref + "]]" : m;
  });
  /* @ is a context, as it reads everywhere else. A person only when no
     context is called that and somebody is -- "@mia" from before @ meant
     contexts still hands it to Mia -- and otherwise a new context. */
  text = text.replace(/(^|\s)@([\p{L}\p{N}_-]+(?:\/[\p{L}\p{N}_-]+)*)/gu, (m, sp, q) => {
    const ctx = known(q);
    if (ctx) return contextOf(text) ? m : sp + "[[c/" + ctx + "]]";
    if (q.includes("/")) return contextOf(text) ? m : sp + "[[c/" + ctxSlug(q) + "]]";
    const hit = nameIndex().find(n => n.kind === "person" &&
      n.title.toLowerCase().split(/\s+/).some(w => w.startsWith(q.toLowerCase())));
    if (!hit) return contextOf(text) ? m : sp + "[[c/" + ctxSlug(q) + "]]";
    who = hit.title;
    return sp;
  });
  return {text, who};
}
