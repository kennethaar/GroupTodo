/* How many a recipe serves, from servings:: ("4", "4 portions", "4-6"). */
function recipeServings(page) {
  const m = /\d+(?:[.,]\d+)?/.exec(String(page?.props?.servings || ""));
  const n = m ? Number(m[0].replace(",", ".")) : 0;
  return n > 0 ? n : null;
}
