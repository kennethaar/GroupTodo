/* The words of some lines and what is under them, but no task and nothing
   under one, and no scene's ## line: that is the scene's name, not its text. */
function proseOf(blocks) {
  const out = [];
  const rec = list => {
    for (const b of list || []) {
      if (b.state || parseTracker(b.title)) continue;
      if (!isSceneHead(b) && !isBeat(b.title, b.state)) for (const t of [b.title, ...(b.body || [])]) if (trim(t || "")) out.push(linkWords(trim(t)));
      rec(b.children);
    }
  };
  rec(blocks);
  return out;
}
