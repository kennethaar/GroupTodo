function askItemMarkdown(item, recipient, n) {
  const parts = String(item.key || "").split("\u0001"),
    space = parts[0] || Spaces.active || "",
    path = parts[1] || "",
    id = parts[2] || "";
  // What the ask found it to be about; worked out here only for an item without one.
  let project = trim(item.project || "");
  if (!project && !("project" in item) && path && !isJournalPath(path))
    project = inSpace(space, () => (V.pages.has(path) ? pageTitle(path) : baseName(path)));
  const q = item.q ? askQuestionParts(Object.assign({}, item, {project}), recipient) : null;
  const t = ASK_NOTE[askLang()];
  // A leading [ would read as a box.
  const unbox = s => s.replace(/^\[/, "(");
  return [
    n + ". " + (!q ? "[ ] " + askLineTitle(item, recipient) + (project ? " (" + project + ")" : "")
      : unbox(q.subject || q.ask)),
    ...(q && q.subject && q.ask ? [ASK_IND + q.ask] : []),
    /* The lines under the task, before the comment, so the importer reads
       past them: a line that is not a box, a comment or a reference is not
       part of the answer. */
    ...(item.context || []).map(c => ASK_IND + "  ".repeat(c.depth) + "· " + unbox(c.text)),
    ASK_IND + (q ? t.answer : t.comment) + " ",
    "",
    ASK_IND + t.reference + " " + space + "-" + id,
  ].join("\n");
}
