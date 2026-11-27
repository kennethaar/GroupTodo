// The line is one the AI wrote: under the catch-up's heading on its page (#516 follow-up).
function cuByAI(path, b) {
  let hit = false;
  const walk = (blocks, under) => {
    for (const k of blocks || []) {
      if (hit) return;
      if (k === b) { hit = under; return; }
      walk(k.children, under || isCatchUpHead(k));
    }
  };
  walk((getPage(path) || {}).blocks, false);
  return hit;
}
