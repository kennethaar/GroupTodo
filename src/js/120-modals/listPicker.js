/* Generic list picker with a-z single-key selection. */
/* A picker, in one of two shapes.

   Positional, the default: the rows are lettered a, b, c down the page and the
   letter is the choice, exactly like the picker in the Neovim config this grew
   out of.

   Typeahead, when `typeahead` is set: you type the name instead. The first
   item starting with what you typed is selected, the same letter again cycles
   through the others starting with it, and Enter takes the selected one. The
   two shapes cannot be mixed in one list: with `computer, errand, phone` the
   letter c means "phone" to one rule and "computer" to the other, and a picker
   you cannot predict is worse than either rule alone. A list whose names you
   know wants typeahead; a list of unfamiliar things wants the letters. */
/* search(item): the words an item is found by when they are more than its
   label -- a person's aliases, say. */
/* note: shown over the list, such as the notes a line is written among (#368). */
function listPicker({title, hint, items, label, detail, onPick, footer, typeahead = false, start = 0, search = null, note = null}) {
  const letters = "abcdefghijklmnopqrstuvwxyz";
  let filtered = items.slice();
  // start -1: nothing is chosen until you type or press an arrow.
  let sel = start, buf = "", bufAt = 0;
  const body = el("div", {});
  const list = el("div", {});
  const words = i => (search ? search(i) : label(i)).toLowerCase();
  const input = el("input", {
    placeholder: "filter...",
    oninput: e => { const q = e.target.value.toLowerCase();
      filtered = items.filter(i => label(i).toLowerCase().includes(q) || words(i).includes(q)); sel = 0; draw(); },
  });
  body.append(...(note ? [note] : []), el("div", {class: "filterbox"}, input), list);
  const plain = it => trim(String(it?.isNew ? it.label : label(it))).toLowerCase().replace(/^@/, "");
  function draw() {
    list.textContent = "";
    if (!filtered.length) list.append(el("div", {class: "empty"}, "No matches."));
    filtered.forEach((it, i) => {
      const key = typeahead ? (i === sel ? "›" : "") : (i < 26 ? letters[i] : String(i + 1));
      const row = pickRow(key, label(it), detail ? detail(it) : null,
                          () => { closeModal(); onPick(it); });
      if (typeahead && i === sel) {
        row.classList.add("on");
        requestAnimationFrame(() => row.scrollIntoView({block: "nearest"}));
      }
      list.append(row);
    });
  }
  const starts = () => filtered.map((it, i) => [i, plain(it)])
    .filter(([i, name]) => name.startsWith(buf) || (search && words(filtered[i]).startsWith(buf))).map(([i]) => i);
  /* What you type shows in the box, so the keys are seen to land somewhere,
     even though it aims rather than filters. */
  const echo = () => { if (typeahead && document.activeElement !== input) input.value = buf; };
  function match() {
    const hit = buf ? starts() : [];
    sel = buf ? (hit.length ? hit[0] : sel) : start;
    echo(); draw();
  }
  function cycle(ch) {
    buf = ch; echo();
    const hit = starts();
    if (!hit.length) return;
    sel = hit[(hit.indexOf(sel) + 1) % hit.length];
    draw();
  }
  draw();
  modal({
    title,
    hint: hint || (typeahead ? "type the name · enter switches · esc cancels"
                             : "letter selects · esc cancels"),
    body,
    foot: footer,
    onKey: e => {
      if (document.activeElement === input && e.key.length === 1) return false;
      if (!typeahead) {
        const i = letters.indexOf(e.key);
        if (i >= 0 && i < filtered.length) { closeModal(); onPick(filtered[i]); return true; }
        return false;
      }
      if (e.key === "Enter") {
        if (!filtered[sel]) return false;
        closeModal(); onPick(filtered[sel]); return true;
      }
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        if (!filtered.length) return true;
        sel = sel < 0 ? (e.key === "ArrowDown" ? 0 : filtered.length - 1)
            : (sel + (e.key === "ArrowDown" ? 1 : -1) + filtered.length) % filtered.length;
        buf = ""; echo(); draw(); return true;
      }
      if (e.key === "Backspace") { buf = buf.slice(0, -1); bufAt = Date.now(); match(); return true; }
      if (e.key.length !== 1 || e.ctrlKey || e.metaKey || e.altKey) return false;
      /* A letter typed again straight away is part of the same word; left for a
         moment it starts a new one. The rule every list box has used for thirty
         years, and the reason pressing p twice cycles the two contexts starting
         with p rather than looking for "pp". */
      const ch = e.key.toLowerCase();
      const stale = Date.now() - bufAt > 1200;
      const again = !stale && buf.length === 1 && buf === ch;
      bufAt = Date.now();
      if (again) { cycle(buf); return true; }
      /* Carrying on the word is the first reading, but if nothing in the list
         starts with what that makes, the letter is taken as the start of a new
         one instead. Otherwise typing w and then changing your mind to p
         leaves you staring at an unchanged list for a second and a bit, with
         no way to know the picker heard you: it is hunting for "wp". */
      const was = buf;
      buf = (stale ? "" : buf) + ch;
      if (!starts().length) buf = ch;
      if (!starts().length && was && !stale) buf = was;   // neither matched: keep the word
      match();
      return true;
    },
  });
  /* The box is not focused. Where the name is the thing you know, the keys
     belong to the list, and the box is there for a word from the middle of a
     name. */
}
