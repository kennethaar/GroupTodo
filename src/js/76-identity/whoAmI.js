/* The name you go by in the area being worked in: V.space, which inSpace()
   points at the area whose journal or members are being read, not only the
   one that is open. Otherwise a Work journal drawn beside Personal is looked
   for under Personal's name, and your own Work page shows as somebody else's. */
function whoAmI() {
  const mine = trim(PREF.get("identity:" + (V.space || Spaces.active || ""), ""));
  if (mine === NO_NAME) return "";
  return mine || trim(PREF.get("identity", "") || "");
}
