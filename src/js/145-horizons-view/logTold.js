function logTold(path, to, text) {
  const page = getPage(path);
  if (!page) return;
  let holder = (page.blocks || []).find(b => plainTitle(b.title) === TOLD_LOG);
  if (!holder) { holder = newBlock({title: TOLD_LOG}); (page.blocks || (page.blocks = [])).push(holder); }
  (holder.children || (holder.children = [])).push(newBlock({title: "[[" + todayISO() + "]] Told [[" + stakeRef(to) + "]]: " + text}));
  touch(path);
}
