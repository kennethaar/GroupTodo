function planTemplate(space) {
  const t = LOADED.get(space || V.space)?.prompts?.get(PLAN_PROMPT_PATH);
  return t != null && trim(t) ? t : PLAN_PROMPT_DEFAULT;
}
