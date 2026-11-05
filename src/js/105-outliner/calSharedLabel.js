/* Who else sees one calendar's meetings, said under its name. */
function calSharedLabel(f) {
  const also = calAlso(f);
  return also.length ? "Shared with " + also.join(", ") : "Private";
}
