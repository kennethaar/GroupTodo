/* Returns "mine" | "member" | "outside". */
function assignKind(name) {
  if (!trim(name) || samePerson(name, whoAmI())) return "mine";
  return isMember(name) ? "member" : "outside";
}
