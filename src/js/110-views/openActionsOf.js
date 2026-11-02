/* The tasks of somebody else in the space, from my side: theirs by name, or
   written on their own day page without anybody else's name on them. */
function openActionsOf(name) {
  if (!trim(name)) return [];
  return openActionsByPerson().get(slugPerson(name)) || [];
}
