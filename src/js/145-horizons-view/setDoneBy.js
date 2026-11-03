function setDoneBy(block, who) {
  const {iso} = splitStamp(blockProp(block, "done_by") || "");
  setBlockProp(block, "done_by", trim(who) + " " + (iso || nowStamp()));
}
