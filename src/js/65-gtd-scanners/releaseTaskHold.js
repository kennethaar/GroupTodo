function releaseTaskHold(path, block) {
  for (let p = block; p; p = p._parent)
    if (Object.keys(p.props || {}).some(k => k.toLowerCase() === "hold"))
      endHold(p.props, holdValue(blockProp(p, "hold")) > todayISO() && hasRepeatUnder([p]));
  touch(path); render();
  notify("Off hold, and back on your lists.");
}
