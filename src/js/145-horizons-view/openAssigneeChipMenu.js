function openAssigneeChipMenu(a) {
  const mine = samePerson(a.assignee, whoAmI());
  chipMenu("\u2192 " + a.assignee, "who is doing it", [
    ["a", "Go to " + a.assignee, "everything of theirs", () => openPersonPage(a.assignee)],
    ["b", "Hand it to somebody else", null, () => inSpace(a.space, () => openAssignOther(a.path, a.block))],
    mine ? null : ["c", "Take it back", "it becomes yours again", () => inSpace(a.space, () => assignBlock(a.path, a.block, ""))],
  ]);
}
