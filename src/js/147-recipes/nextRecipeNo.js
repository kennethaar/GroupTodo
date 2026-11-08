/* The next free recipe number in this area: one more than the highest no::,
   or than the number a recipe's name starts with. */
function nextRecipeNo() {
  let top = 0;
  for (const [path, page] of V.pages) {
    if (!path.startsWith(DIRS.recipes + "/")) continue;
    const n = Number(page?.props?.no) || Number((/^(\d+)\s/.exec(baseName(path)) || [])[1]) || 0;
    if (n > top) top = n;
  }
  return top + 1;
}
