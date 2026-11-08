/* One ingredient line, its leading amount times factor: "400 g beef" x1.5 is
   "600 g beef". A line that does not start with an amount ("salt to
   taste") is left as it is. Only the amount and its unit change. */
function scaleIngredient(line, factor) {
  const m = RECIPE_AMOUNT_RE.exec(line);
  if (!m || !(factor > 0) || factor === 1) return line;
  const [all, lead, a, sep, b, gap, unitRaw] = m;
  const said = a + (b || "");
  const style = {decimals: /[.,]/.test(said), comma: said.includes(",")};
  const unitWord = (unitRaw || "").replace(/[.,;:)]+$/, "");
  const tail = (unitRaw || "").slice(unitWord.length);
  let unit = unitWord.toLowerCase();
  let lo = recipeAmount(a) * factor, hi = b ? recipeAmount(b) * factor : null;
  let rule = RECIPE_METRIC[unit];
  if (rule) {
    const top = hi ?? lo;
    if (rule.up && top >= rule.up[1]) { lo /= rule.up[1]; if (hi != null) hi /= rule.up[1]; unit = rule.up[0]; }
    else if (rule.down && top < 1) { lo *= rule.down[1]; if (hi != null) hi *= rule.down[1]; unit = rule.down[0]; }
    rule = RECIPE_METRIC[unit];
  }
  const text = v => recipeAmountText(v, {...style, places: rule ? rule.places(hi ?? lo) : null});
  const word = rule && unit !== unitWord.toLowerCase() ? unit : unitWord;
  return lead + text(lo) + (b ? sep + text(hi) : "") + gap + word + tail + line.slice(all.length);
}
