/* #526 A line with no context is missing one, unless it waits on somebody
   else: they do it, not you somewhere, so where you are does not matter.
   A waiting-for that names nobody is asked who instead (missingWho). */
function needsContext(b, page) {
  if (blockContext(b) || b.state === "WAIT") return false;
  const who = assigneeOf(b, page);
  return !who || samePerson(who, whoAmI());
}
