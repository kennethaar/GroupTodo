/* Format on the line tools (#416): markdown without knowing it. Bold and
   Italic do what Ctrl+B and Ctrl+I do. A heading level or Quote puts its
   mark at the front of the line, in place of one already there; the same
   one again takes it off. Table makes an empty note a 2-column table, or
   adds one under a line that has words. */
function editBarFormat(k) {
  const {txt, path, page, block: b} = FLY;
  if (k === "bold" || k === "italic") {
    autoPairKey({ctrlKey: true, key: k === "bold" ? "b" : "i", preventDefault() {}}, txt);
    return;
  }
  if (k === "table") {
    const head = tableRowText(["Column 1", "Column 2"]);
    const rows = [tableRowText(["---", "---"]), tableRowText(["", ""])];
    let t = b;
    if (trim(lineText(txt))) {
      t = newBlock({title: head, body: rows});
      const list = siblingsOf(page, b);
      list.splice(list.indexOf(b) + 1, 0, t);
    } else {
      txt.textContent = head;
      b.body = [...rows, ...(b.body || [])];
    }
    txt.blur();
    if (t === b) b.title = head;
    touch(path); noteTodoTouched(); render();
    tableFocusRow(t, 1);
    return;
  }
  const text = lineText(txt), [from, to] = caretOffsets(txt);
  const had = (/^(#{1,6}[ \t]+|>[ \t]+)/.exec(text) || [, ""])[1];
  const want = k === "quote" ? "> " : "#".repeat(+k[1]) + " ";
  const mark = trim(had) === trim(want) ? "" : want;
  const shift = mark.length - had.length;
  // Remembered first, so Ctrl+Z takes the mark back and no more.
  const ev = new InputEvent("beforeinput", {inputType: "insertText", bubbles: true, cancelable: true});
  ev.gtPair = true;
  txt.dispatchEvent(ev);
  setHostText(txt, mark + text.slice(had.length), Math.max(mark.length, from + shift));
  if (to !== from) setHostSelection(txt, Math.max(mark.length, from + shift), Math.max(mark.length, to + shift));
  txt.dispatchEvent(new Event("input", {bubbles: true}));
  const line = txt.closest(".line");
  if (line) paintHeadLine(line, lineText(txt), b.state);
}
