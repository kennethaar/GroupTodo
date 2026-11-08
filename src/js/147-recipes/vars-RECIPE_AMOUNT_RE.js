/* The amount an ingredient line starts with: 400, 1.5, 1,5, 1/2, 1 1/2, 1½,
   ½, or a range of two of them, 2-3. Then the unit, if a word follows. */
const RECIPE_FRACTIONS = {"½": 1 / 2, "⅓": 1 / 3, "⅔": 2 / 3, "¼": 1 / 4, "¾": 3 / 4, "⅛": 1 / 8};
const RECIPE_ONE = "(\\d+\\s+\\d+\\/\\d+|\\d+\\/\\d+|\\d+[½⅓⅔¼¾⅛]|\\d+(?:[.,]\\d+)?|[½⅓⅔¼¾⅛])";
const RECIPE_AMOUNT_RE = new RegExp("^(\\s*)" + RECIPE_ONE + "(?:(\\s*[-–]\\s*)" + RECIPE_ONE + ")?(?![\\d/.,])(\\s*)([^\\s\\d][^\\s]*)?");
/* Metric units shown as decimals, and the next unit up or down: 1000 g is
   1 kg, 10 dl is 1 l, 0.5 kg is 500 g. Every other unit, and a bare count,
   is rounded to quarters, the way a cook halves an egg or a spoon. */
const RECIPE_METRIC = {
  g:  {up: ["kg", 1000], places: v => v >= 10 ? 0 : 1},
  kg: {down: ["g", 1000], places: () => 2},
  ml: {up: ["l", 1000], places: v => v >= 10 ? 0 : 1},
  cl: {up: ["l", 100], places: () => 1},
  dl: {up: ["l", 10], places: () => 1},
  l:  {down: ["dl", 10], places: () => 2},
};
