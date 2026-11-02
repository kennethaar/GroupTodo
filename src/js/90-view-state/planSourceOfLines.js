/* The lines as they read, without the app's own bookkeeping, and the line
   they are written under: "Ring Alex" under "Storebrand release" is about
   the release. An email a line links to comes along whole. */
function planSourceOfLines(path, blocks) {
  const page = getPage(path);
  if (!page || !blocks.length) return null;
  flattenBlocks(page.blocks);
  const out = [], par = blocks[0]._parent;
  if (par && trim(par.title)) out.push("(Written under the line: " + par.title + ")", "");
  const emit = (b, d) => {
    const pad = "  ".repeat(d);
    out.push(pad + "- " + (b.state ? b.state + " " : "") + b.title);
    for (const k of ["DEADLINE", "SCHEDULED"]) { const v = blockProp(b, k); if (v) out.push(pad + "  " + k + ":: " + v); }
    for (const l of b.body || []) if (trim(l)) out.push(pad + "  " + l);
    for (const c of b.children || []) emit(c, d + 1);
  };
  blocks.forEach(b => emit(b, 0));
  const mails = new Set();
  walkBlocks(blocks, b => {
    for (const l of linksIn(b.title)) {
      const t = trim(l.split("][")[0]);
      const p = t.startsWith("m/") ? findExistingPage(t) : null;
      if (p && p !== path) mails.add(p);
    }
  });
  for (const m of mails) out.push("", planEmailText(m));
  let proj = statusDirOf(path) && !isJournalPath(path) ? {path, title: pageTitle(path)} : null;
  if (!proj) {
    const link = nearestProjectAncestor(blocks[0]);
    const at = link && findExistingPage(link.ref);
    if (at) proj = {path: at, title: pageTitle(at)};
  }
  return {space: V.space, kind: "lines", path, ids: blocks.map(b => b.id), text: out.join("\n"), project: proj};
}
