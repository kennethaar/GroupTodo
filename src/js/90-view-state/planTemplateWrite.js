async function planTemplateWrite(space, text) {
  const rec = LOADED.get(space || V.space);
  if (!rec || !rec.backend || !rec.backend.writable) throw new Error("This area cannot be written to.");
  if (rec.hold) throw new Error("This area's folder is not connected. Connect it first.");
  await rec.backend.write(PLAN_PROMPT_PATH, text);
  (rec.prompts || (rec.prompts = new Map())).set(PLAN_PROMPT_PATH, text);
}
