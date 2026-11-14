/* Shift+Enter: the line and the lines under it in a monospace box, as in
   Notepad, with the caret's line and column, and search and replace (#392).
   Spaces stay as written: a run of lines drawn with spaces or box marks goes
   in a ``` fence, as a pasted mockup does (#374). at is the caret's offset in
   the text, the bullet's words first. */
function openNotepad(path, b, at = 0) {
  const pad = el("textarea", {class: "notepad", spellcheck: "false", wrap: "off",
    "aria-label": "The line and the lines under it"});
  pad.value = [b.title || "", ...(b.body || [])].join("\n");
  const where = el("span", {class: "npcaret", "aria-live": "polite"});
  const found = el("span", {class: "npfound", "aria-live": "polite"});
  const find = el("input", {class: "npfind", type: "search", placeholder: "Find", "aria-label": "Find"});
  const repl = el("input", {class: "nprepl", type: "text", placeholder: "Replace with", "aria-label": "Replace with"});

  const showCaret = () => {
    const before = pad.value.slice(0, pad.selectionStart).split("\n");
    where.textContent = "Ln " + before.length + ", Col " + (before[before.length - 1].length + 1);
  };
  // Found as written, big or small letters alike, as Notepad does.
  const hits = () => {
    const word = find.value;
    if (!word) return [];
    const out = [], hay = pad.value.toLowerCase(), w = word.toLowerCase();
    for (let i = hay.indexOf(w); i >= 0; i = hay.indexOf(w, i + w.length)) out.push(i);
    return out;
  };
  const count = () => {
    const n = hits().length;
    found.textContent = find.value ? (n ? n + " found" : "Not found") : "";
  };
  const findNext = () => {
    const list = hits();
    if (!list.length) { count(); return false; }
    const from = pad.selectionEnd;
    const i = list.find(x => x >= from) ?? list[0];
    pad.focus();
    pad.setSelectionRange(i, i + find.value.length);
    showCaret();
    return true;
  };
  const replaceOne = () => {
    const sel = pad.value.slice(pad.selectionStart, pad.selectionEnd);
    if (find.value && sel.toLowerCase() === find.value.toLowerCase()) {
      pad.setRangeText(repl.value, pad.selectionStart, pad.selectionEnd, "end");
    }
    findNext();
    count();
  };
  const replaceAll = () => {
    const list = hits();
    if (!list.length) { count(); return; }
    let text = pad.value;
    for (const i of list.reverse()) text = text.slice(0, i) + repl.value + text.slice(i + find.value.length);
    pad.value = text;
    count();
    notify(list.length + (list.length === 1 ? " replaced." : " replaced."));
  };

  let saved = false;
  const save = () => {
    if (saved) return;
    saved = true;
    const lines = pad.value.replace(/\r\n?/g, "\n").split("\n");
    const title = lines.shift();
    while (lines.length && trim(lines[lines.length - 1]) === "") lines.pop();
    const body = notepadFence(lines.map(l => l.replace(/\s+$/, "")));
    const was = JSON.stringify([b.title || "", ...(b.body || [])]);
    b.title = title;
    if (body.length) b.body = body; else delete b.body;
    if (JSON.stringify([b.title, ...(b.body || [])]) !== was) { touch(path); noteTodoTouched(); }
    render();
    focusBlock(b.id);
  };

  pad.addEventListener("input", () => { showCaret(); count(); });
  for (const ev of ["keyup", "click", "select", "focus"]) pad.addEventListener(ev, showCaret);
  pad.addEventListener("keydown", e => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) { e.preventDefault(); closeModal(); }
    else if (e.key === "f" && (e.ctrlKey || e.metaKey)) { e.preventDefault(); find.focus(); find.select(); }
  });
  find.addEventListener("input", count);
  find.addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); findNext(); } });
  repl.addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); replaceOne(); } });

  modal({
    title: "Notepad", hint: "Ctrl+Enter saves · Ctrl+F finds",
    body: el("div", {class: "npbox"},
      el("div", {class: "npsearch"}, find, repl,
        el("button", {class: "btn sm ghost", onclick: findNext}, "Find next"),
        el("button", {class: "btn sm ghost", onclick: replaceOne}, "Replace"),
        el("button", {class: "btn sm ghost", onclick: replaceAll}, "Replace all"),
        found),
      pad),
    foot: [where, el("div", {style: "flex:1"}), el("button", {class: "btn", onclick: () => closeModal()}, "Done")],
    onClose: save,
  });
  const caret = Math.max(0, Math.min(at, pad.value.length));
  pad.focus();
  pad.setSelectionRange(caret, caret);
  showCaret();
}
