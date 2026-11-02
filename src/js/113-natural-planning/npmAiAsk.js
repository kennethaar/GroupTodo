function npmAiAsk() {
  const title = npmIn(() => pageTitle(NPM.path));
  const text = "I am planning a project: \"" + title + "\"." + (trim(NPM.outcome) ? " Done means: " + trim(NPM.outcome) + "." : "") +
    "\nThe ideas I have so far:\n" + NPM.ideas.map(i => "- " + i.t).join("\n") +
    "\n\nName 3 more things I should think about that are not on the list. One short line each, no numbers, nothing else.";
  copyText(text, "Prompt copied. Paste it into your AI, then paste its answer here.", "Copy this into your AI");
  const url = planAiOf(NPM.space);
  if (url) window.open(url, "_blank", "noopener");
  NPM.ai = true; npmSave(); render();
}
