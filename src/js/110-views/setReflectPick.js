/* Toward and away are one choice: picking the other one moves the line, and
   picking the same one again takes it back. Picks come first under the line. */
function setReflectPick(path, b, way) {
  const id = ensureBlockId(path, b).toLowerCase();
  const r = reflectionBlock(true), kids = r.block.children = r.block.children || [];
  const at = kids.findIndex(k => (PICK_RE.exec(k.title || "") || [])[2]?.toLowerCase() === id);
  const was = at >= 0 ? PICK_RE.exec(kids[at].title)[1].toLowerCase() : null;
  if (at >= 0) kids.splice(at, 1);
  if (was !== way) {
    let i = 0;
    while (i < kids.length && PICK_RE.test(kids[i].title || "")) i++;
    kids.splice(i, 0, newBlock({title: way + ":: ((" + id + "))"}, false));
  }
  r.block.collapsed = false;
  touch(r.path);
  render();
}
