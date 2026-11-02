/* Closed by somebody who is not here. Same three stamps the tick writes, so a
   task finished by a colleague outside the app reads identically to one
   finished inside it -- which it is. */
function closeOnTheirWord(path, block, who, at) {
  block.state = "DONE";
  setBlockProp(block, "done_by", who + " " + at);
  const end = dateIn(at) || todayISO();
  const added = addedDate(block);
  const raw = blockProp(block, "Added") || "";
  if (added && !/\]\]\s*-\s*\[\[/.test(raw)) {
    setBlockProp(block, "Added", raw + " - [[" + end + "]] = " + (dateDiffDays(added, end) ?? 0) + " days");
  } else if (!added && !blockProp(block, "CLOSED")) {
    setBlockProp(block, "CLOSED", "[[" + end + "]]");
  }
}
