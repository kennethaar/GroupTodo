/* Toward or away from which intention (#210)? With one intention there is
   nothing to ask; with more, a menu of them, and Take it off last when this
   way is already picked. */
function pickReflectAim(path, b, way, cur) {
  const aims = intentionBlocks();
  const link = a => setReflectPick(path, b, way, a ? ensureBlockId(INTENTIONS_PATH, a).toLowerCase() : "");
  if (aims.length < 2) return link(aims[0]);
  const id = a => trim(blockProp(a, "id") || "").toLowerCase();
  chipMenu(way === "toward" ? "Toward which intention?" : "Away from which intention?", "",
    lettered([...aims.map(a => [trim(a.title), cur?.way === way && cur.aim && cur.aim === id(a) ? "picked" : "", () => link(a)]),
      cur?.way === way ? ["Take it off", "", () => setReflectPick(path, b, way, cur.aim)] : null]));
}
