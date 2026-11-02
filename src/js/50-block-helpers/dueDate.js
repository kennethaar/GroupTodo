function dueDate(b) {
  return dateIn(blockProp(b, "SCHEDULED")) || dateIn(blockProp(b, "DEADLINE")) || dateIn(blockProp(b, "due"));
}
