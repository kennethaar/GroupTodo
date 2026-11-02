/* The pages a drag is carrying, whatever kind of card they came from, as
   {path, space} -- which is all a cross-space move needs to know. A task drag
   carries no pages: a task is a line inside somebody else's file. */
function boardPageItems(d) {
  if (!d || !d.items) return null;
  if (d.kind === "project") return d.items.map(x => ({path: x.project.path, space: x.project.space || V.space}));
  if (d.kind === "dirpage") return d.items.map(x => ({path: x.page.path, space: x.page.space || V.space}));
  return null;
}
