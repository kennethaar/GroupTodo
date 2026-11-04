/* A line and what is under it. On a scene's ## line, the scene and its lines. */
function cutLineToDarlings(path, block) {
  const page = getPage(path), sibs = siblingsOf(page, block), at = sibs.indexOf(block);
  const taken = [block];
  if (isSceneHead(block) && sibs === page.blocks)
    for (let i = at + 1; i < sibs.length && !isSceneHead(sibs[i]); i++) taken.push(sibs[i]);
  // A scene's lines after its ## line go under it while it is a darling; lines:: says how many.
  const props = {...rememberPlace(path, block), lines: taken.length > 1 ? String(taken.length - 1) : ""};
  for (const b of taken) removeBlockFrom(page, b);
  if (taken.length > 1) block.children = [...(block.children || []), ...taken.slice(1)];
  keepDarling(block, props);
  touch(path);
  darlingCut(block, isSceneHead(block) ? "The scene" : "The paragraph");
}
