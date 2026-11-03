/* The page a next round would go on, by its link: "2026-W45" or the day. */
function choreNextRef(block, when) {
  if (!isChoreBlock(block) || !when) return null;
  return choreRepeatOnWeek(repeatOf(block)) ? weekOf(when) : when;
}
