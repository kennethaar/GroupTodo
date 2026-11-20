/* A ``` fence under a line, drawn as a notepad box (#392): the lines as
   written, in a fixed-width font, Enter a new line as in Notepad. Esc or
   Shift+Enter goes back to the end of the main line; a click away saves too.
   The caret's line and column sit quietly in the foot; ⤢ grows the box into
   the notepad, with find and replace. An emptied box leaves the file.
   ▾ at its top left folds it to one line; Copy text leaves a folded box out.
   from and to are the fence lines in b.body. */
function noteBoxEl(path, b, from, to) {
  // ▾ folds the box to one line, ▸ opens it; the fence keeps which (fenceFolded).
  const setFold = on => {
    if (!b.body || !b.body[from]) return;
    b.body[from] = fenceFold(b.body[from], on);
    touch(path); noteTodoTouched();
    render();
    requestAnimationFrame(() => $(`.blk[data-id="${b.id}"] > .notebox[data-bi="${from}"] .nbfold`)?.focus());
  };
  if (fenceFolded(b.body[from])) {
    const n = to - from - 1;
    return el("div", {class: "notebox folded", data: {bi: String(from)}},
      el("button", {class: "nbfold", type: "button", "aria-expanded": "false",
        title: "Show the note", onclick: () => setFold(false)},
        el("span", {class: "nbarrow", "aria-hidden": "true"}, "▸"),
        el("span", {}, "┄ " + n + (n === 1 ? " line" : " lines") + " ┄")));
  }
  const pad = el("textarea", {class: "nbtext", spellcheck: "false", wrap: "off",
    "aria-label": "Note under the line"});
  pad.value = b.body.slice(from + 1, to).join("\n");
  const where = el("span", {class: "npcaret", "aria-live": "polite"});
  const fit = () => { pad.rows = Math.max(1, pad.value.split("\n").length); };
  const showCaret = () => {
    const before = pad.value.slice(0, pad.selectionStart).split("\n");
    where.textContent = "Ln " + before.length + ", Col " + (before[before.length - 1].length + 1);
  };
  fit();

  let gone = false;
  /* The box written back into b.body. Says how the body changed: null for
     nothing, else the change in its number of lines. */
  const save = () => {
    if (gone || !b.body) return null;
    const lines = pad.value.replace(/\r\n?/g, "\n").split("\n").map(l => l.replace(/\s+$/, ""));
    while (lines.length && lines[lines.length - 1] === "") lines.pop();
    while (lines.length && lines[0] === "") lines.shift();
    const was = b.body.slice(from, to + 1);
    const next = lines.length ? [b.body[from], ...lines, b.body[to]] : [];
    if (JSON.stringify(next) === JSON.stringify(was)) return null;
    b.body.splice(from, to - from + 1, ...next);
    const grew = next.length - was.length;
    if (!next.length) gone = true; else to += grew;
    if (!b.body.length) delete b.body;
    touch(path); noteTodoTouched();
    return grew;
  };
  const backToLine = () => {
    save();
    gone = true;   // the redraw below replaces this box
    render();
    focusLineAt(`.blk[data-id="${b.id}"] .txt`, (b.title || "").length);
  };

  pad.addEventListener("input", () => { fit(); showCaret(); });
  for (const ev of ["keyup", "click", "select", "focus"]) pad.addEventListener(ev, showCaret);
  pad.addEventListener("keydown", e => {
    if (e.key === "Escape" || (e.key === "Enter" && e.shiftKey && !e.ctrlKey && !e.metaKey && !e.altKey)) {
      e.preventDefault();
      e.stopPropagation();
      backToLine();
    }
  });
  pad.addEventListener("blur", () => {
    const grew = save();
    if (grew == null) return;
    // Lines below the box are drawn by their place in the body: redraw when it moved.
    const after = gone ? (b.body || []).length > from : (b.body || []).length > to + 1;
    if (grew && after) setTimeout(() => render(), 0);
    else if (gone) box.remove();
  });

  const zoom = el("button", {class: "nbzoom", type: "button", title: "Expand: find and replace",
    "aria-label": "Expand the note to the notepad",
    onmousedown: e => e.preventDefault(),
    onclick: () => {
      const at = pad.selectionStart;
      save();
      gone = true;
      openNotepad(path, b, at);
    }}, "⤢");
  const fold = el("button", {class: "nbfold", type: "button", "aria-expanded": "true",
    title: "Fold the note: Copy text leaves it out", "aria-label": "Fold the note",
    onmousedown: e => e.preventDefault(),
    onclick: () => { save(); if (gone) { render(); return; } gone = true; setFold(true); }},
    el("span", {class: "nbarrow", "aria-hidden": "true"}, "▾"));
  const box = el("div", {class: "notebox", data: {bi: String(from)}},
    fold, pad, zoom, el("div", {class: "nbfoot"}, where));
  return box;
}
