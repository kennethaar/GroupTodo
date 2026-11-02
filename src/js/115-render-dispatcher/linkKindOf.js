/* ---------- a pill is a handle, not only a door ----------
   Clicking a context or a project or a person in a line used to go there, full
   stop. But the thing you usually want from a pill is to change it: wrong
   context, belongs to another project, that is not the person waiting. Going
   there was the only thing it offered and the thing you wanted least often.

   So a pill opens the same menu a chip opens, with the alternatives listed in
   it rather than behind a "change" you press first. A menu whose only item is
   another menu is a wasted click. */
function linkKindOf(ref) {
  const pfx = (/^([^/]+)\//.exec(trim(ref)) || [])[1];
  if (pfx === "c") return "context";
  if (pfx === "p") return "person";
  if (pfx === "o") return "org";
  if (pfx === "z") return "note";
  if (pfx && STATUS_DIRS[pfx]) return "project";
  return null;
}
