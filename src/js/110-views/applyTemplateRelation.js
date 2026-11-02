function applyTemplateRelation(path, selectedPath, direction) {
  if (!direction || !selectedPath || selectedPath === path) return true;
  const current = {path, space: V.space};
  const selected = {path: selectedPath, space: V.space};
  if (direction === "^") {
    if (relWouldCycle(selected, current)) { notify("That would create a hierarchy cycle.", "warn"); return false; }
    relAddParent(selected, current);
  } else if (direction === "_") {
    if (relWouldCycle(current, selected)) { notify("That would create a hierarchy cycle.", "warn"); return false; }
    relAddParent(current, selected);
  }
  return true;
}
