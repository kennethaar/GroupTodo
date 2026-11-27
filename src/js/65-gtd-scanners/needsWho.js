/* A waiting-for that names nobody cannot be followed up: there is nobody to
   ask. So it is asked who, the way a to-do is asked where. */
function needsWho(b, page) {
  return b.state === "WAIT" && !assigneeOf(b, page);
}
