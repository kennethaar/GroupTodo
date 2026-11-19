/* Every link into one folder, pointed at another: [[k/Packing]] becomes
   [[8/Packing]], and [[O/Acme]] becomes [[o/Acme]] (#434). The folder is
   matched as written, so [[o/...]] is left alone when O is moved. */
function rewriteLinkFolder(from, to) {
  const re = new RegExp("\\[\\[" + from.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "/", "g");
  for (const [path, page] of V.pages) {
    let hit = false;
    const fix = str => { const n = String(str).replace(re, "[[" + to + "/"); if (n !== str) hit = true; return n; };
    walkBlocks(page.blocks, b => {
      b.title = fix(b.title);
      b.body = (b.body || []).map(fix);
      for (const k of Object.keys(b.props || {})) b.props[k] = fix(b.props[k]);
    });
    for (const k of Object.keys(page.props || {})) page.props[k] = fix(page.props[k]);
    if (hit) touch(path);
  }
}
