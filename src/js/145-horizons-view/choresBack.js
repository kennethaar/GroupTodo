function choresBack(held) {
  for (const a of held) inSpace(a.space, () => {
    for (let p = a.block; p; p = p._parent)
      if (Object.keys(p.props || {}).some(k => k.toLowerCase() === "hold")) endHold(p.props, true);
    touch(a.path);
  });
  render();
  notify("Welcome back. Your chores count from today.");
}
