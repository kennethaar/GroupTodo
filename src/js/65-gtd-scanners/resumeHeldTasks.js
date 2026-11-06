function resumeHeldTasks() {
  if (!V.loaded) return;
  const back = acrossSpaces(() => resumeHeldHere(todayISO()));
  if (!back.length) return;
  clearMemo();
  render();
  const msg = back.length === 1
    ? "“" + plainTitle(back[0].block.title) + "” is off hold and back on your lists."
    : back.length + " tasks are off hold and back on your lists.";
  notify(msg, "info", {label: "Undo", run: () => {
    for (const g of back) inSpace(g.space, () => {
      g.block.state = g.before.state;
      g.block.props = g.before.props;
      touch(g.path);
    });
    clearMemo(); render();
    notify("Back on hold.");
  }});
}
