/* An answer to "Does it wait for another step?": the step it waits for goes
   under it (#275). "" is No, it can go now; "all" is They can all go at once.
   When every sequence has been asked, three or more left standing are
   written parallel:: yes, so the project is not asked again. */
function actSortTake(r, to) {
  const cur = actSortNow(r);
  if (!cur && to !== "all") return;
  const S = ACT_SORT;
  inS(r, () => {
    const page = getPage(r.path);
    if (!page) return;
    S.past.push({page: clonePage(page), asked: S.asked.slice()});
    if (to && to !== "all") {
      const from = bs => { const i = (bs || []).indexOf(to); if (i < 0) return false; bs.splice(i, 1); return true; };
      let gone = from(page.blocks);
      walkBlocks(page.blocks, b => { if (!gone) gone = from(b.children); });
      if (gone) cur.children = [...(cur.children || []), to];
    }
    if (cur) S.asked.push(cur.title);
    touch(r.path);
  });
  clearMemo();
  if (to === "all" || !actSortNow(r)) actSortEnd(r);
  render();
}
