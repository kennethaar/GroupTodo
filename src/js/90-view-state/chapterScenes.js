function chapterScenes(path) {
  const out = [];
  let cur = null;
  for (const b of getPage(path)?.blocks || []) {
    if (isSceneHead(b)) { cur = {path, block: b, name: sceneName(b), lines: [...(b.children || [])]}; out.push(cur); continue; }
    if (!cur) { cur = {path, block: null, name: "", lines: []}; out.push(cur); }
    cur.lines.push(b);
  }
  return out.filter(s => s.block || proseOf(s.lines).length);
}
