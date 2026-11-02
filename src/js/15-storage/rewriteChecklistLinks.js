function rewriteChecklistLinks() {
  const re = /\[\[k\/([^\]]+)\]\]/g;
  for (const [path, page] of V.pages) {
    let hit = false;
    const fix = str => { const n = String(str).replace(re, "[[8/$1]]"); if (n !== str) hit = true; return n; };
    walkBlocks(page.blocks, b => {
      b.title = fix(b.title);
      b.body = (b.body || []).map(fix);
      for (const k of Object.keys(b.props || {})) b.props[k] = fix(b.props[k]);
    });
    for (const k of Object.keys(page.props || {})) page.props[k] = fix(page.props[k]);
    if (hit) touch(path);
  }
}
