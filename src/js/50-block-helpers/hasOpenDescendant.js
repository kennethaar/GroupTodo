/* A ((reference)) under a task to an open line elsewhere is a step of it too:
   the task waits for it like for one written in place. */
function hasOpenDescendant(block) {
  let open = false;
  walkBlocks(block.children, b => {
    if (OPEN_STATES[b.state]) open = true;
    else for (const m of String(b.title || "").matchAll(/\(\(([A-Za-z0-9_-]{4,64})\)\)/g))
      if (OPEN_STATES[blockById(m[1])?.block.state]) open = true;
  });
  return open;
}
