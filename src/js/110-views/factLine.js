/* ---------- one fact, as a line of the document ----------
   Focus swaps the decoration for the raw text and blur swaps it back, which is
   exactly how a block's own line already behaves.

   Simple draws the value as a pill: a control that says what to do with it.
   Advanced draws the line as it is written in the file, links and all, because
   somebody who chose Advanced wants to see the markdown they will later edit in
   an editor -- the pill hides the very thing they came for. */
function factLine(path, f) {
  const line = el("div", {class: "pfact" + (f.cls ? " " + f.cls : "")});
  const raw = false;
  const txt = el("div", {
    class: "ftxt" + (f.save ? "" : " ro"),
    contenteditable: f.save ? "true" : "false", spellcheck: "false",
    title: f.save ? (raw ? "Click a link to follow it, or beside it to type the line"
                         : "Click a pill for what to do with it, or beside it to type the line") : "",
  });
  const paint = () => {
    txt.textContent = "";
    if (raw) {
      const value = /::\s*([\s\S]*)$/.exec(f.raw || "")?.[1] || "";
      if (templateChoiceDirective(value)) {
        txt.append(el("span", {contenteditable:"false"}, f.key + ":: "));
        for (const pill of f.pills()) txt.append(pill);
      } else {
        txt.innerHTML = renderInline(f.raw);
        if (/::\s*$/.test(f.raw)) txt.append(blankFactPill(path,f));
      }
      return;
    }
    txt.append(el("span", {class: "fkey", contenteditable: "false"}, f.key));
    // The review's own fields keep the review's chooser even when empty.
    if (!f.own && /::\s*$/.test(f.raw)) txt.append(blankFactPill(path,f)); else for (const p of f.pills()) txt.append(p);
  };
  paint();
  if (f.save) {
    /* The click that opens the line lands after focus has swapped the pills for
       the raw text, so the caret went wherever the mouse now was in it --
       "aliases:|: JS". The first click only opens it, at the end; once you
       are typing, a click puts the caret where you clicked. A pill that does
       something has already said no to this mousedown. */
    txt.addEventListener("mousedown", e => {
      if (document.activeElement === txt || e.defaultPrevented) return;
      e.preventDefault();
      txt.focus();
    });
    txt.addEventListener("focus", () => setHostText(txt, f.raw, f.raw.length));
    txt.addEventListener("blur", () => {
      const val = lineText(txt);
      if (trim(val) !== trim(f.raw)) { f.save(val); render(); return; }
      paint();
    });
    txt.addEventListener("keydown", e => {
      if (e.key === "Enter") { e.preventDefault(); txt.blur(); }
      else if (e.key === "Escape") { e.preventDefault(); setHostText(txt, f.raw, f.raw.length); txt.blur(); }
    });
  }
  line.append(txt);
  return line;
}
