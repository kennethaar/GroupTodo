/* Copies a prompt for the area's AI and opens it. kind is "ideas" (Brainstorm) or "rules" (Rules we play by).
   NPM.ai says which question waits for the answer: true for ideas, as drafts from before #277 have it, or "rules". */
function npmAiAsk(kind) {
  const title = npmIn(() => pageTitle(NPM.path));
  const list = a => a.map(l => "- " + l).join("\n");
  const head = "I am planning a project: \"" + title + "\"." + (trim(NPM.outcome) ? " Done means: " + trim(NPM.outcome) + "." : "");
  const text = kind === "rules"
    ? head + (NPM.purpose.length ? "\nWhy:\n" + list(NPM.purpose) : "") +
      (NPM.onpurpose.length ? "\nMust achieve:\n" + list(NPM.onpurpose) : "") +
      (NPM.principles.length ? "\nThe rules we play by so far:\n" + list(NPM.principles) : "") +
      "\n\nSuggest 3 more rules we should play by: standards that hold even when it costs. One short line each, no numbers, nothing else."
    : head + "\nThe ideas I have so far:\n" + list(NPM.ideas.map(i => i.t)) +
      "\n\nName 3 more things I should think about that are not on the list. One short line each, no numbers, nothing else.";
  copyText(text, "Prompt copied. Paste it into your AI, then paste its answer here.", "Copy this into your AI");
  const url = planAiOf(NPM.space);
  if (url) window.open(url, "_blank", "noopener");
  NPM.ai = kind === "rules" ? "rules" : true; npmSave(); render();
}
