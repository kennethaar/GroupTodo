/* "1 1/2", "1½", "½", "1,5" or "400" as a number. */
function recipeAmount(s) {
  s = trim(s);
  let m = /^(\d+)\s+(\d+)\/(\d+)$/.exec(s);
  if (m) return Number(m[1]) + Number(m[2]) / Number(m[3]);
  if ((m = /^(\d+)\/(\d+)$/.exec(s))) return Number(m[1]) / Number(m[2]);
  if ((m = /^(\d*)([½⅓⅔¼¾⅛])$/.exec(s))) return Number(m[1] || 0) + RECIPE_FRACTIONS[m[2]];
  return Number(s.replace(",", "."));
}
