/* Every comment from somebody else since you were last here that no outcome
   has handled yet, oldest first: the order it is answered in. A space seen
   for the first time starts from now, as the news always did. */
function feedbackQueue() {
  if (!whoAmI()) return [];
  return acrossSpaces(() => {
    const since = lastSeen();
    if (!since) { markSeen(); return []; }
    return newsSince(since).filter(n => n.kind === "said" && !isHandled(n.msg))
      .map(n => Object.assign(n, {space: V.space}));
  }).sort((x, y) => x.at.localeCompare(y.at));
}
