function toggleMsgFlag(path, m) {
  const me = whoAmI();
  if (!me) { notify("Put your name in first - a flag is a name.", "warn"); return; }
  const now = msgFlags(m).filter(n => !samePerson(n, me));
  if (now.length === msgFlags(m).length) now.push(me);
  if (now.length) setBlockProp(m, MSG_FLAG, now.join(", "));
  else for (const k of Object.keys(m.props)) if (k.toLowerCase() === MSG_FLAG) delete m.props[k];
  touch(path);
  render();
}
