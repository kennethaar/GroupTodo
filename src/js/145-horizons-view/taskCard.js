/* A list draws what you can actually look at, and offers the rest.
   Rendering every open task was 3.7 seconds at five thousand of them and ten
   at twenty thousand -- a to-do list that takes ten seconds to appear is
   broken, however correct the contents. The counts in the headings are still
   the true totals; only the rows are rationed. */
function taskCard(actions, emptyText, rowOpts) {
  return pagedCard(actions, rowOpts ? a => taskRow(a, rowOpts) : a => taskRow(a), emptyText);
}
