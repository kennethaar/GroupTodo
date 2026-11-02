/* A project in 1/ whose every open step is waiting on somebody is waiting
   for, whatever folder it sits in. It is shown there, marked "auto". */
function autoWaiting(r) {
  if (inSpace(r.space, () => statusDirOf(r.path)) !== "1") return false;
  const open = openOf(projectActions(r));
  return open.length > 0 && open.every(a => a.state === "WAIT" || !a.mine);
}
