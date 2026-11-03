/* The area a line is written in, when that area holds a book. */
function bookSpaceOf(host) {
  const space = host?.closest?.("[data-space]")?.dataset.space || V.space;
  return inSpace(space, hasBook) ? space : null;
}
