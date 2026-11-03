/* The scene the line is in, for who is likely to talk: its pov:: and with::. */
function sceneOfBlock(path, block) {
  if (!block) return null;
  const holds = list => { let hit = false; walkBlocks(list, b => { if (b === block) hit = true; }); return hit; };
  return chapterScenes(path).find(s => s.block === block || holds(s.lines)) || null;
}
