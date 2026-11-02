const doneToday = () => memo("doneToday", () => acrossSpaces(doneTodayHere));
const closedDate = b => dateIn(blockProp(b, "CLOSED")) ||
  ((trim(blockProp(b, "Added") || "").match(/\]\]\s*-\s*\[\[(\d{4}-\d{2}-\d{2})/) || [])[1] || "");
