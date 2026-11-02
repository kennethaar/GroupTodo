/* The lines as you left them in the note. A line you changed comes back as
   {edit: {s, t, c}}, what it is about, the question or task, and the lines
   under it; one you left alone comes back as it was. */
function askItemsEdited(items, body, recipient) {
  const now = askNoteLines(body), was = askNoteLines(askItemsMarkdown(items, recipient));
  return items.map(it => {
    const parts = String(it.key || "").split("\u0001"),
      ref = (parts[0] || Spaces.active || "") + "-" + (parts[2] || "");
    const lines = now.get(ref) || [];
    const ctx = lines.map(l => /^(\s*)·\s?(.*)$/.exec(l)).filter(Boolean)
      .map(m => ({depth: Math.max(0, (m[1].length - ASK_IND.length) >> 1), text: m[2]}));
    const words = lines.filter(l => !/^\s*·/.test(l)).map(l => trim(l.replace(/^\s*\d+[.)]\s*/, "")));
    if (!words.length || JSON.stringify(lines) === JSON.stringify(was.get(ref) || [])) return it;
    let s = "", t;
    if (!it.q) t = trim(words.join(" ").replace(/^(?:[-*•·]\s*)?\[[^\[\]]*\]\s*/, ""));
    else if (words.length > 1) { s = words[0]; t = words.slice(1).join(" "); }
    else t = words[0];
    return Object.assign({}, it, {edit: {s, t, c: ctx}});
  });
}
