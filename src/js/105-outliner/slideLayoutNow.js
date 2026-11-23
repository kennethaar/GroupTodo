/* The layout these lines have now, as the Slide layout menu ticks it: the
   word on the line they belong to (#481), else their own old marks (#433). */
function slideLayoutNow(path, lines) {
  const owner = slideOwner(path, lines);
  return (owner && slideWord(owner.title).layout) || slideMarkOf(lines);
}
