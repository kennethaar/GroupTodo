function ensureWeek(id) {
  const path = journalPath(id);
  if (V.pages.has(path) || !weekMonday(id)) return path;
  const page = {props: {title: id, created: todayStamp()}, blocks: []};
  let prev = null;
  for (let n = 1; n <= 12 && !prev; n++) {
    const p = journalPath(shiftWeek(id, -n));
    if (V.pages.has(p)) prev = p;
  }
  const fresh = b => {
    const c = cloneBlock(b);
    walkBlocks([c], x => {
      if (x.state) x.state = "TODO";
      for (const k of Object.keys(x.props || {}))
        if (/^(id|closed|done_by|done_at|added|scheduled|deadline|due|hold)$/i.test(k)) delete x.props[k];
    });
    return c;
  };
  const take = blocks => {
    for (const b of blocks || []) {
      if (isWeekRoutine(b)) page.blocks.push(fresh(b));
      else take(b.children);
    }
  };
  if (prev) take(getPage(prev).blocks);
  putPage(path, page);
  return path;
}
