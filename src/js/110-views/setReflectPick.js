/* Toward and away are one choice: picking the other one moves the line, and
   picking the same one, for the same intention, again takes it back. Picks
   come first under the line. aim is the intention's id, or "" for none. */
function setReflectPick(path, b, way, aim = "") {
  const id = ensureBlockId(path, b).toLowerCase();
  const r = reflectionBlock(true), kids = r.block.children = r.block.children || [];
  const at = kids.findIndex(k => (PICK_RE.exec(k.title || "") || [])[2]?.toLowerCase() === id);
  const m = at >= 0 ? PICK_RE.exec(kids[at].title) : null;
  const same = m && m[1].toLowerCase() === way && (m[3] || "").toLowerCase() === aim.toLowerCase();
  if (at >= 0) kids.splice(at, 1);
  if (!same) {
    let i = 0;
    while (i < kids.length && PICK_RE.test(kids[i].title || "")) i++;
    kids.splice(i, 0, newBlock({title: way + ":: ((" + id + "))" + (aim ? " ((" + aim + "))" : "")}, false));
  }
  r.block.collapsed = false;
  touch(r.path);
  clearMemo();
  render();
}
