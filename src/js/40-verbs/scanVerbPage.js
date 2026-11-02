function scanVerbPage(path) {
  if (!path.startsWith(DIRS.verbs + "/")) return;
  const rest = path.slice(DIRS.verbs.length + 1).split("/");
  if (rest.length < 2) return;
  const lang = rest[0];
  const canonical = baseName(path).toLowerCase();
  const synonyms = [];
  const page = getPage(path);
  const scan = txt => {
    const m = /^\s*([\p{L}\p{M}\-_ ]+?)\s*=\s*([\p{L}\p{M}\-_ ]+?)\s*$/u.exec(txt || "");
    if (!m) return;
    const syn = m[1].toLowerCase();
    synonyms.push(syn);
    VERB_LOOKUP[syn] = canonical;
  };
  walkBlocks(page.blocks, b => { scan(b.title); (b.body || []).forEach(scan); });
  VERB_LOOKUP[canonical] = canonical;
  VERB_CANON[canonical] = {lang, path, synonyms};
}
