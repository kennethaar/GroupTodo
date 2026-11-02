function stateChip(st, block = null) {
  if (!st) return null;              // a plain note carries no tick
  const stage = block && stageLabel(block);
  return el("span", {class: "tick", data: {state: st}, title: stage ? stage + " (counts as " + CORE_WORD[st] + ")" : CORE_WORD[st] || st},
    ...tickParts(st, block));
}
