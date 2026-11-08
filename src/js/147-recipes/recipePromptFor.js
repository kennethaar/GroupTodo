function recipePromptFor(text, space) {
  return planTemplate(space, RECIPE_PROMPT_PATH, RECIPE_PROMPT_DEFAULT).replace(/\{text\}/g, () => trim(text || ""));
}
