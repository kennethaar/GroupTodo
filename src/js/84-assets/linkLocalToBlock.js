function linkLocalToBlock(path, b, names, txt) {
  // Where the caret was at the drop: the dialog takes the focus away.
  let spot = null;
  if (txt && document.activeElement === txt) {
    const whole = lineText(txt);
    const [from, to] = caretOffsets(txt);
    spot = [whole.slice(0, from), whole.slice(to)];
  }
  const parent = safeLS.get(LOCAL_PARENT_KEY, "");
  const one = names.length === 1;
  const input = el("input", {"aria-label": "Path", spellcheck: "false",
    placeholder: "C:\\Users\\me\\Projects" + (one ? "\\" + names[0] : ""),
    value: parent ? parent.replace(/[\\/]+$/, "") + (one ? "\\" + names[0] : "") : ""});
  const save = () => {
    let p = trim(input.value).replace(/^"|"$/g, "");
    if (!p) return;
    closeModal();
    if (FILE_LINK_RE.test(p)) p = filePathOf(p);
    // One path given for several: it is the folder they sit in.
    const full = one ? [p] : names.map(n => p.replace(/[\\/]+$/, "") + "\\" + n);
    const up = full[0].replace(/[\\/]+[^\\/]+[\\/]*$/, "");
    if (up && up !== full[0]) safeLS.set(LOCAL_PARENT_KEY, one ? up : p);
    const addition = full.map(f => {
      const label = (f.replace(/[\\/]+$/, "").split(/[\\/]/).pop() || f).replace(/[[\]]/g, "");
      return "[" + label + "](" + fileHref(f) + ")";
    }).join(" ");
    let caret = null;
    if (spot) {
      const [before, after] = spot;
      const lead = before && !/\s$/.test(before) ? " " : "";
      b.title = before + lead + addition + (after && !/^\s/.test(after) ? " " : "") + after;
      caret = (before + lead + addition).length;
    } else {
      const cur = trim(b.title);
      b.title = cur ? cur + " " + addition : addition;
    }
    touch(path); noteTodoTouched();
    render();
    if (caret != null) focusLineAt(`.blk[data-id="${b.id}"] .txt`, caret);
  };
  input.addEventListener("keydown", e => {
    if (e.key === "Enter") { e.preventDefault(); save(); }
  });
  modal({
    center: true, title: one ? "Where is \u201C" + names[0] + "\u201D?" : "Where are these " + names.length + "?",
    body: el("div", {class: "field"},
      el("label", {}, one ? "The full path. The browser only tells the app its name."
                          : "The folder they are in. The browser only tells the app their names."),
      input),
    foot: [el("button", {class: "btn ghost", onclick: () => closeModal()}, "Cancel"),
           el("button", {class: "btn primary", onclick: save}, "Link")],
  });
  requestAnimationFrame(() => { input.focus(); input.select(); });
}
