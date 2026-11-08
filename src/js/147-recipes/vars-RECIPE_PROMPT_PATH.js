/* ============================================================
   RECIPES (#327)
   A recipe is a page in k/, numbered so a printed copy can be filed by it.
   It comes in through an AI, the way a project plan does: the AI reads the
   link or the text and writes it in metric, so the page is stored in one
   kind of unit and scaling it is only arithmetic. Turning cups of flour into
   grams needs to know what flour weighs; the AI knows, this file does not
   need to. The app itself never talks to an AI.
   ============================================================ */
const RECIPE_PROMPT_PATH = join(PROMPT_DIR, "Recipe.md");
const RECIPE_PROMPT_DEFAULT = `Turn the recipe at the bottom into a recipe page. If the bottom is a web address, read the recipe at that address. Write in the same language as the recipe.

Use metric units only:
- weight in g or kg, never ounces or pounds
- liquids in ml, dl or l, never cups, fluid ounces, pints or quarts
- a cup of something dry (flour, sugar, rice, cheese) becomes grams of that ingredient
- tsp and tbsp stay tsp and tbsp
- °F becomes °C, inches become cm
Round to amounts a cook would measure.

Answer ONLY with the page in one code block, nothing before or after it, in exactly this shape:

<Recipe name>
servings:: <how many it serves, a number>
time:: <the total time, like 45 min>
category:: <one word, like Dinner, Baking or Soup>
source:: <the web address, or the book and page>

## Ingredients
- <amount> <unit> <ingredient>
## Steps
- <one step per line>
## Notes
- <tips, storage, variations; leave Notes out if there are none>

Ingredient lines:
- Start with the amount as a number: 400 g minced beef, 2 onions, 0.5 tsp salt. Write 1.5, not 1 1/2.
- No amount, as in salt to taste: start with the ingredient.
- A group, as in For the sauce, is a line of its own with its ingredients under it, indented two spaces.
- Leave out a line above whose value is not known.

THE RECIPE:
"""
{text}
"""`;
/* What was pasted and answered so far, kept while the app is open, so the
   dialog closed to go and get the answer comes back with it. */
let RECIPE_DRAFT = {text: "", answer: ""};
