function expireOverdue() {
  if (!V.loaded) return;
  const gone = acrossSpaces(() => expireHere(todayISO()));
  if (!gone.length) return;
  clearMemo();
  render();
  const msg = gone.length === 1
    ? "“" + plainTitle(gone[0].block.title) + "” ran past its until:: date and is cancelled."
    : gone.length + " tasks cancelled: past their until:: date.";
  notify(msg, "info", {label: "Undo", run: () => {
    for (const g of gone) inSpace(g.space, () => {
      g.block.state = g.before.state;
      g.block.props = g.before.props;
      setBlockProp(g.block, "expire", "never");
      touch(g.path);
    });
    clearMemo(); render();
    notify("Back on your list, marked expire:: never so they stay.");
  }});
}
