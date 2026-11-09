/* The prompt for the lines in entries ({space, path, block}): what each is
   about, its own words, your notes under it and what it already has. */
function askAiPrompt(entries, name, space = V.space) {
  const items = entries.map((e, i) => inSpace(e.space, () => {
    const b = e.block, title = plainTitle(b.title), project = askProjectOf(e);
    const notes = contextLinesOf(b), has = k => trim(blockProp(b, k) || "");
    return [(i + 1) + ". " + (project || title),
      ...(project ? ["   Task: " + title] : []),
      ...(notes.length ? ["   My notes:", ...notes.map(l => "   " + "  ".repeat(l.depth) + "- " + l.text)] : []),
      ...[["Question so far", ASK_Q_PROP], ["Summary so far", ASK_BRIEF_PROP], ["Why so far", ASK_WHY_PROP]]
        .filter(([, k]) => has(k)).map(([label, k]) => "   " + label + ": " + has(k)),
    ].join("\n");
  })).join("\n\n");
  return planTemplate(space, ASK_PROMPT_PATH, ASK_PROMPT_DEFAULT)
    .replace(/\{person\}/g, () => name)
    .replace(/\{language\}/g, () => ASK_AI_LANG[askLang()] || "English")
    .replace(/\{items\}/g, () => items);
}
