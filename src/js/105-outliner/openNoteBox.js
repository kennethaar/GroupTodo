/* Shift+Enter, or Notepad on a phone's foot bar: a notepad box under the line
   (#392). The main line can't be empty. Whatever is already written under the
   line goes into the box, so a line has one note; the file keeps it in a ```
   fence, which you never type. txt is the main line while it is being edited:
   its text is checked before blur writes it back. */
function openNoteBox(path, b, txt = null) {
  const title = txt ? lineText(txt) : (b.title || "");
  if (!trim(title)) { notify("Write the line first."); return; }
  if (txt) txt.blur();   // blur writes the line back first
  const body = b.body || [];
  const fence = l => (/^\s*```/).test(l);   // in brackets: the language catalog reads a regex after ( only
  const one = body.length >= 2 && fence(body[0]) && fence(body[body.length - 1]) &&
    !body.slice(1, -1).some(fence);
  if (!one) {
    const lines = body.filter(l => !fence(l));
    b.body = ["```", ...lines, "```"];
    // An empty box is not written to the file until something is typed in it.
    if (lines.length) { touch(path); noteTodoTouched(); }
  }
  render();
  requestAnimationFrame(() => {
    if ($("#modalRoot").firstChild) return;
    const pad = $(`.blk[data-id="${b.id}"] > .notebox textarea`);
    if (!pad) return;
    pad.focus();
    pad.setSelectionRange(pad.value.length, pad.value.length);
    pad.dispatchEvent(new Event("select"));
  });
}
