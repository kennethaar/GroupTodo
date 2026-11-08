/* A recipe's ingredients for cookFor people, scaled from servings::. Null
   when the page does not say how many it serves. The page is not changed. */
function recipeScaledLines(path, cookFor) {
  const page = getPage(path), serves = recipeServings(page);
  if (!serves) return null;
  return recipeIngredientLines(page).map(l => scaleIngredient(l, cookFor / serves));
}
