/* An area's own prompt at path in 8/Prompts/, or the standard one. */
function planTemplate(space, path = PLAN_PROMPT_PATH, standard = PLAN_PROMPT_DEFAULT) {
  const t = LOADED.get(space || V.space)?.prompts?.get(path);
  return t != null && trim(t) ? t : standard;
}
