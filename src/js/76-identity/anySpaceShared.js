/* Is there anybody else at all? True once any one space has a second member --
   the moment a conversation has somebody on the other end of it. */
function anySpaceShared() {
  return memo("anySpaceShared", () => {
    const names = visibleSpaces();
    if (names.length <= 1) return membersNow().length > 1;
    return names.some(n => LOADED.has(n) && inSpace(n, membersNow).length > 1);
  });
}
