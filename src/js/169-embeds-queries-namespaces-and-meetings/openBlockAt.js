/* Open the page a line is on and bring the line to the middle, in whichever
   area it lives. */
function openBlockAt(space, path, block) {
  const centre = () => {
    const n = block && document.querySelector(idSel(".blk", block.id, ".txt"));
    if (n) centerLinkText(n);
    return !!n;
  };
  openPageIn(space, path);
  requestAnimationFrame(() => requestAnimationFrame(() => { if (!centre()) setTimeout(centre, 250); }));
}
