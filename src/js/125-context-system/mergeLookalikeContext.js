// Merged a moment later, once whoever made it has written the line that names it.
function mergeLookalikeContext(name) {
  const old = contextLookalike(name);
  if (!old) return;
  const space = V.space;
  setTimeout(() => inSpace(space, () => mergeContextInto(name, old,
    "@" + name + " looks like @" + old + ", so it is @" + old + " now.")), 0);
}
