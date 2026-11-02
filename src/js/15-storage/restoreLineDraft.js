function restoreLineDraft(d) {
  inSpace(d.space, () => {
    let path = d.path, page = V.pages.get(path);
    if (!page) { path = ensureJournal(todayISO()); page = V.pages.get(path); }
    let target = null;
    walkBlocks(page.blocks, blk => { if (!target && blk.title === d.base) target = blk; });
    const [st, rest] = splitState(d.text);
    if (target && path === d.path) {
      if (st) { target.state = st; target.title = rest; } else target.title = d.text;
    } else {
      page.blocks.push(newBlock(st ? {state: st, title: rest} : {title: d.text}));
    }
    touch(path);
  });
  forgetLineDraft();
  render();
  notify("Line restored.");
}
