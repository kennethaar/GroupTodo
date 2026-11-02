function removeBlockFrom(page, block) {
  const rec = list => {
    const i = list.indexOf(block);
    if (i >= 0) { list.splice(i, 1); return true; }
    return list.some(b => rec(b.children || []));
  };
  return rec(page.blocks);
}
