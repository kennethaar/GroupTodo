function clearExistingStamps() {
  let n = 0;
  for (const [path, page] of V.pages) {
    let hit = false;
    if (page.props && page.props.updated_by) { delete page.props.updated_by; hit = true; n++; }
    walkBlocks(page.blocks, b => {
      if (!b.props) return;
      if (b.props.by)      { delete b.props.by; hit = true; n++; }
      if (b.props.done_by) { delete b.props.done_by; hit = true; n++; }
    });
    if (hit) touch(path);
  }
  notify(n ? "Removed " + n + " attribution stamp(s) from " + Spaces.active + "."
           : "No stamps to remove.");
  render();
  return n;
}
