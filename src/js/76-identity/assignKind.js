/* Returns "mine" | "member" | "household" | "outside". */
function assignKind(name) {
  if (!trim(name) || samePerson(name, whoAmI())) return "mine";
  return isMember(name) ? "member" : isHousehold(name) ? "household" : "outside";
}
