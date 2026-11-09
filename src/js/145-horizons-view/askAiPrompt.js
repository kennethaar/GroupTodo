/* The prompt for the lines in entries ({space, path, block}): the project
   pages they are on, each once, with the lines asked about marked, and then
   each line: what it is about, its own words and what it already has. A line
   on a day page has no project page, so its notes go with it instead. */
function askAiPrompt(entries, name, space = V.space) {
  const pages = new Map();
  const items = entries.map((e, i) => inSpace(e.space, () => {
    const b = e.block, title = plainTitle(b.title), project = askProjectOf(e);
    const onPage = !!project && !!e.path && !isJournalPath(e.path) && V.pages.has(e.path);
    if (onPage) {
      const key = (e.space || "") + "\u0001" + e.path;
      if (!pages.has(key)) pages.set(key, {space: e.space, path: e.path, title: project, marks: new Map()});
      pages.get(key).marks.set(b, i + 1);
    }
    const notes = onPage ? [] : contextLinesOf(b), has = k => trim(blockProp(b, k) || "");
    return [(i + 1) + ". " + (project || title),
      ...(project ? ["   Task: " + title] : []),
      ...(onPage ? ["   On the project page " + project + ", marked <- item " + (i + 1)] : []),
      ...(notes.length ? ["   My notes:", ...notes.map(l => "   " + "  ".repeat(l.depth) + "- " + l.text)] : []),
      ...[["Question so far", ASK_Q_PROP], ["Summary so far", ASK_BRIEF_PROP], ["Why so far", ASK_WHY_PROP]]
        .filter(([, k]) => has(k)).map(([label, k]) => "   " + label + ": " + has(k)),
    ].join("\n");
  })).join("\n\n");
  const background = [...pages.values()].map(p =>
    "=== Project page: " + p.title + " ===\n" + inSpace(p.space, () => askPageForAi(p.path, p.marks))).join("\n\n");
  const all = (background ? "PROJECT PAGES\n\n" + background + "\n\nITEMS\n\n" : "") + items;
  return planTemplate(space, ASK_PROMPT_PATH, ASK_PROMPT_DEFAULT)
    .replace(/\{person\}/g, () => name)
    .replace(/\{language\}/g, () => ASK_AI_LANG[askLang()] || "English")
    .replace(/\{items\}/g, () => all);
}
