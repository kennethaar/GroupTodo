/* Puts these pins, in this order, on your person page in the area V points
   at. False when there is no page to put them on yet (pinsHome). */
function writeAreaPins(paths) {
  if (!pinsHome()) return false;
  const me = ensureMemberPage(), page = getPage(me);
  const value = paths.map(p => "[[" + linkRefTo(p) + "]]").join(", ");
  if ((page.props.pins || "") === value) return true;
  if (value) page.props.pins = value; else delete page.props.pins;
  touch(me);
  return true;
}
