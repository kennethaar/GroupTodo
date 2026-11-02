/* [[_/Old idea]] now means a horizon, so point the ones that were projects at
   pages/-/. A link to a page still sitting in pages/_/ is left alone: that is
   either a horizon or something this vault never cancelled. */
function rewriteCancelledLinks() {
  const re = /\[\[_\/([^\]]+)\]\]/g;
  const moved = name => V.pages.has(join(DIRS.cancelled, trim(name).replace(/\.md$/i, "") + ".md"));
  for (const [path, page] of V.pages) {
    let hit = false;
    const fix = str => {
      const n = String(str).replace(re, (m, name) => {
        if (!moved(name)) return m;
        hit = true;
        return "[[-/" + name + "]]";
      });
      return n;
    };
    walkBlocks(page.blocks, b => {
      b.title = fix(b.title);
      b.body = (b.body || []).map(fix);
      for (const k of Object.keys(b.props || {})) b.props[k] = fix(b.props[k]);
    });
    for (const k of Object.keys(page.props || {})) page.props[k] = fix(page.props[k]);
    if (hit) touch(path);
  }
}
