/* A task's state on a line of text: a square in the state's colour with the
   state in small letters inside -- to do too, since a task type's stages are
   told apart by it. A stage is said in its own words. */
function tickParts(st, block) {
  const stage = block && stageLabel(block);
  // A long stage name is cut short to the square's width; hovering says it all.
  return [el("span", {class: "t-state " + st, title: stage || null}, stage || CORE_WORD[st] || st)];
}
