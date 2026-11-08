/* The lines under a recipe's Ingredients heading, nested ones too, in order.
   The heading may be in the recipe's own language. */
function recipeIngredientLines(page) {
  const head = b => /^#{1,6}\s*(ingredien|zutaten)/i.test(trim(b.title || ""));
  let found = null;
  walkBlocks(page?.blocks || [], b => { if (!found && head(b)) found = b; });
  if (!found) return [];
  const out = [];
  walkBlocks(found.children || [], b => { if (trim(b.title || "")) out.push(b.title); });
  return out;
}
