function askNote(name, items, file = null) {
  const t = ASK_NOTE[askLang()],
    lines = askItemsMarkdown(items, name);
  return {subject: t.subject(items, name), body: askNoteBody(name.split(" ")[0], whoAmI() || "", lines, file, askKinds(items))};
}
