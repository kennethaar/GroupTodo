async function planTemplateWrite(space, text, path = PLAN_PROMPT_PATH) {
  const rec = LOADED.get(space || V.space);
  if (!rec || !rec.backend || !rec.backend.writable) throw new Error("This area cannot be written to.");
  if (rec.hold) throw new Error("This area's folder is not connected. Connect it first.");
  await rec.backend.write(path, text);
  (rec.prompts || (rec.prompts = new Map())).set(path, text);
}
