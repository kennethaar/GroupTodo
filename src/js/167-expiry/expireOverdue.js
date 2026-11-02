function expireOverdue() {
  if (!V.loaded) return;
  const gone = acrossSpaces(() => expireHere(todayISO()));
  if (!gone.length) return;
  clearMemo();
  render();
  const bdays = gone.filter(g => g.why === "birthday").length;
  const msg = gone.length === 1
    ? "“" + plainTitle(gone[0].block.title) + "” " +
      (gone[0].why === "until" ? "ran past its until:: date" : "was for a birthday that has passed") +
      " and is cancelled."
    : gone.length + " tasks cancelled: " +
      [bdays ? bdays + " for a birthday that has passed" : null,
       gone.length - bdays ? (gone.length - bdays) + " past their until:: date" : null]
        .filter(Boolean).join(", ") + ".";
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
