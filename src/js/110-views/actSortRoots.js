/* ---------- sorting a project's steps into sequences (#462) ----------
   A step that must come first is written under the one that waits for it
   (#275), so each top open step of yours is one sequence, and its deepest
   open step is the very next action. A project whose steps all stand on
   their own has as many sequences as steps: too many cards for one review,
   so before its first card the review asks, step by step, what waits. */
function actSortRoots(r) {
  const leaves = new Set(actDeck().filter(a => a.path === r.path && a.space === r.space).map(a => a.block));
  return inS(r, () => {
    const page = getPage(r.path), roots = [];
    if (!page) return roots;
    const holds = b => leaves.has(b) || (b.children || []).some(holds);
    const walk = bs => { for (const b of bs || []) {
      if (b.state === "TODO" || b.state === "DOING") { if (holds(b)) roots.push(b); }
      else if (!OPEN_STATES[b.state]) walk(b.children);
    } };
    walk(page.blocks);
    return roots;
  });
}
