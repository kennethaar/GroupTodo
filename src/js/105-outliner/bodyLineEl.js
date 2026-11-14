/* ---------- a block's body lines ----------
   Everything under a bullet that is not itself a bullet -- a markdown heading
   like "## Purpose:", a quote, a wrapped paragraph -- is kept as that block's
   body. It is still the person's own writing, so it is edited in place like
   any other line: before this, a line that happened to arrive without a dash
   in front of it could only be changed by opening the file.

   Enter keeps you in the body rather than cutting a bullet out of half a
   paragraph, and backspacing an empty one away lands you on the line above. */
function bodyLineEl(path, b, i) {
  // In a ``` fence a line is drawn as written, in the monospace font (#374).
  const code = fenceRows(b)[i] || 0;
  const draw = () => { if (code) txt.textContent = b.body[i]; else { txt.innerHTML = renderInline(b.body[i]); resolveAssets(txt); } };
  const txt = el("div", {
    class: "bodyline" + (i < tableRows(b) ? " tblrow" : "") + (code === 1 ? " codefence" : code === 2 ? " codeline" : ""),
    contenteditable: "true", spellcheck: "false", data: {bi: String(i)}, translate: "no",
  });
  if (code) txt.textContent = b.body[i]; else txt.innerHTML = renderInline(b.body[i]);
  // Same bargain as a bullet's own line: a click on a [[link]] follows it
  // instead of dropping the caret into the raw text behind it; a picture opens.
  txt.addEventListener("mousedown", e => {
    if (e.target.closest("[data-link], [data-bref], a[href], img.asset")) e.preventDefault();
  });
  keepClickCaret(txt, () => b.body[i]);
  txt.addEventListener("focus", () => { txt.textContent = b.body[i]; });
  txt.addEventListener("blur", () => {
    const val = lineText(txt);
    /* "DEADLINE:: [[2026-10-30]]" written under a task is a property of it, the
       way the file reads it back. Taken as one at once, rather than sitting as
       text until the next load quietly turns it into a date. */
    const prop = !code && /^\s*([A-Za-z][\w-]*)::\s*(.*)$/.exec(val);
    if (prop && val !== b.body[i] && trim(prop[2])) {
      b.body.splice(i, 1);
      setBlockProp(b, prop[1], trim(prop[2]));
      touch(path); noteTodoTouched();
      // Not from inside blur: the redraw would pull the element out from under it.
      setTimeout(() => render(), 0);
      return;
    }
    if (val !== b.body[i]) {
      b.body[i] = val;
      if (!code) createLinkedPages(val);
      touch(path); noteTodoTouched();
    }
    draw();
  });
  /* Several lines pasted here stay several lines, as written (#374). Text that
     holds its shape by its spaces, a mockup or a table drawn in characters,
     goes in a ``` fence so the file keeps it and the page draws it monospace. */
  txt.addEventListener("paste", e => {
    const raw = e.clipboardData && e.clipboardData.getData("text/plain");
    if (raw == null) return;
    const lines = raw.replace(/\r\n?/g, "\n").split("\n").map(l => l.replace(/\s+$/, ""));
    while (lines.length && lines[0] === "") lines.shift();
    while (lines.length && lines[lines.length - 1] === "") lines.pop();
    if (lines.length < 2) return;
    e.preventDefault();
    const whole = lineText(txt);
    const [from, to] = caretOffsets(txt);
    const before = whole.slice(0, from), after = whole.slice(to);
    const add = !code && looksPreformatted(lines) ? ["```", ...lines, "```"] : lines;
    // Blur is what writes the line back, so hand it the half that stays.
    txt.textContent = before;
    txt.blur();
    const rest = [...add, ...(trim(after) ? [after] : [])];
    const at = trim(before) === "" ? i : i + 1;
    b.body.splice(at, at === i ? 1 : 0, ...rest);
    touch(path); noteTodoTouched(); render();
    focusBodyLine(b.id, at + add.length - 1);
  });
  attachSuggest(txt);
  txt.addEventListener("input", () => keepCaretInSight(txt));
  txt.addEventListener("keydown", e => {
    if (suggestKey(e)) return;
    if (tableTab(e, path, b, i, txt)) return;
    if (e.key === "Enter" && !e.shiftKey && !e.ctrlKey && !e.metaKey && tableEnter(path, b, i, txt)) { e.preventDefault(); return; }
    // Shift+Enter opens the notepad here too, the caret where it was (#392).
    if (e.key === "Enter" && e.shiftKey && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault();
      const at = (b.title || "").length + 1 + b.body.slice(0, i).reduce((n, l) => n + l.length + 1, 0) + caretOffsets(txt)[0];
      txt.blur();
      openNotepad(path, b, at);
      return;
    }
    if (e.key === "Enter" && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      const whole = lineText(txt);
      const [from, to] = caretOffsets(txt);
      // Blur is what writes the line back, so hand it the half that stays.
      txt.textContent = whole.slice(0, from);
      txt.blur();
      b.body.splice(i + 1, 0, whole.slice(to));
      touch(path); render(); focusBodyLine(b.id, i + 1, false);
      centerNewLine(`.blk[data-id="${b.id}"] > .bodyline[data-bi="${i + 1}"]`);
    } else if (e.key === "Backspace" && txt.textContent === "") {
      e.preventDefault();
      txt.blur();
      b.body.splice(i, 1);
      touch(path); render();
      if (i > 0) focusBodyLine(b.id, i - 1); else focusBlock(b.id);
    } else if (e.key === "Backspace" && !e.shiftKey && !e.altKey && !e.ctrlKey && !e.metaKey &&
               caretOffsets(txt).join() === "0,0") {
      // Onto the end of the line above: the body line before, or the bullet itself.
      e.preventDefault();
      txt.blur();
      const text = b.body[i];
      b.body.splice(i, 1);
      let at;
      if (i > 0) { at = b.body[i - 1].length; b.body[i - 1] += text; }
      else { at = (b.title || "").length; b.title = (b.title || "") + text; }
      touch(path); noteTodoTouched(); render();
      focusLineAt(i > 0 ? `.blk[data-id="${b.id}"] > .bodyline[data-bi="${i - 1}"]`
                        : `.blk[data-id="${b.id}"] .txt`, at);
    } else if (e.key === "Escape") {
      txt.blur();
    }
  });
  return txt;
}
