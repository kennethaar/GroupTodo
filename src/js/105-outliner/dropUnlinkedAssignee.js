/* Taking a person's link out of a task takes the task off them too: the line
   no longer says who has it, so assigned:: must not go on saying it. */
function dropUnlinkedAssignee(b, before) {
  const who = waitingPersonName(blockProp(b, ASSIGN_PROP));
  if (!who) return;
  const key = slugPerson(who);
  if (!personLinksOf(before).has(key) || personLinksOf(b.title).has(key)) return;
  for (const k of Object.keys(b.props)) if (/^assigned(_at)?$/i.test(k)) delete b.props[k];
}
