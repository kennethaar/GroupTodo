/* Credited to somebody else after the tick: the next one's turn is worked
   out again, unless it was already handed to someone by hand. */
function recreditChore(space, id, who, again) {
  return inSpace(space, () => {
    const f = findBlock(id);
    if (!f || f.block.state !== "DONE") return null;
    setDoneBy(f.block, who);
    touch(f.path);
    clearMemo();
    if (!again) return {};
    const c = findBlock(again.copy.id);
    if (!c || (assigneeOf(c.block) || "") !== (again.who && !samePerson(again.who, whoAmI()) ? again.who : "")) return {};
    const turn = whoseTurn(f.block);
    if (turn) { assignBlock(c.path, c.block, turn, true); again.who = turn; }
    return {turn};
  });
}
