function openVerbPicker(path, block) {
  const lang = verbLang();
  const all = verbList();
  const mine = all.filter(v => v.lang === lang);

  const useVerb = word => { prependVerb(path, block, word); render(); };

  /* Teaching a word that is already the first word clears the flag and rewrites
     nothing, which is the common case: the verb was there all along, the
     lexicon had simply never heard it.

     A word from the middle is taught just the same, but the line still does not
     start with it. Shuffling the word to the front would turn "Kabelen ma
     trekkes gjennom roret" into "Trekkes Kabelen ma gjennom roret", which is
     mechanically correct and not a sentence. Rewriting a line so it still reads
     is a person's job, so this says what is wrong and opens the line for
     editing rather than pretending a regex can write Norwegian. */
  const teachFromTitle = word => {
    if (!teachVerb(word, lang)) { notify("A verb is one word of letters.", "warn"); return; }
    closeModal();
    const starts = plainTitle(block.title).toLowerCase().startsWith(trim(word).toLowerCase());
    touch(path); render();
    if (starts) { notify("\u201C" + word + "\u201D is a verb now, in " + VERB_LANG_NAME[lang] + "."); return; }
    notify("\u201C" + word + "\u201D is a verb now, but this line does not start with it.",
      "warn", {label: "Reword the line", run: () => openTaskDetail(path, block)});
  };

  const body = el("div", {});

  // --- language tabs
  const tabs = el("div", {class: "statefilter"});
  for (const code of verbLangs()) {
    tabs.append(el("button", {class: "chip filter" + (code === lang ? " on" : ""),
      onclick: () => { PREF.set("verbLang", code); closeModal({keepQueue: true}); openVerbPicker(path, block); }},
      (code === lang ? "\u2713 " : "") + (VERB_LANG_NAME[code] || code)));
  }
  body.append(el("div", {class: "field"}, el("label", {}, "Language"), tabs));

  // --- the words already in the task
  const cands = verbCandidatesIn(block.title);
  if (cands.length) {
    const row = el("div", {class: "statefilter"});
    for (const w of cands)
      row.append(el("button", {class: "chip filter", title: "Teach the lexicon this word",
        onclick: () => teachFromTitle(w)}, w));
    body.append(el("div", {class: "field"},
      el("label", {}, "A word in this task is the action"),
      row,
      el("div", {style: "color:var(--fg3);font-size:12px;margin-top:6px"},
        "Press one and the lexicon learns it, so this line and every line like it " +
        "counts from now on. Nothing is rewritten unless you say so.")));
  }

  // --- pick one from the lexicon
  const list = el("div", {style: "max-height:34vh;overflow:auto"});
  const draw = q => {
    list.textContent = "";
    const hits = mine.filter(v => !q || v.canonical.includes(q));
    if (!hits.length) {
      list.append(el("div", {class: "empty"},
        mine.length ? "No matches." : "No verbs in " + (VERB_LANG_NAME[lang] || lang) + " yet."));
      return;
    }
    hits.forEach(v => list.append(pickRow("\u00b7", capitalise(v.canonical),
      (VERB_CANON[v.canonical]?.synonyms || []).filter(x => x !== v.canonical).slice(0, 3).join(", "),
      () => { closeModal(); useVerb(v.canonical); })));
  };
  const filter = el("input", {placeholder: "filter...",
    oninput: e => draw(trim(e.target.value).toLowerCase())});
  draw("");
  body.append(el("div", {class: "field"},
    el("label", {}, "Or start the line with one of these"), filter, list));

  // --- a verb the lexicon has never heard of
  const own = el("input", {placeholder: "a verb a camera could film",
    onkeydown: e => { if (e.key === "Enter") { e.preventDefault(); addOwn(); } }});
  const addOwn = () => {
    const w = trim(own.value);
    if (!w) return;
    if (!teachVerb(w, lang)) { notify("A verb is one word of letters.", "warn"); return; }
    closeModal(); useVerb(w);
  };
  body.append(el("div", {class: "field"},
    el("label", {}, "Add one of your own, in " + (VERB_LANG_NAME[lang] || lang)),
    el("div", {style: "display:flex;gap:8px"}, own,
      el("button", {class: "btn ghost", onclick: addOwn}, "Add"))));

  modal({
    center: true,
    title: "Make it physical and visible",
    hint: "what would a camera see you doing?",
    body,
    foot: [
      el("button", {class: "btn ghost", onclick: closeModal}, "Not now"),
      mine.length ? null
        : el("button", {class: "btn primary", onclick: () => {
            closeModal(); seedVerbs(); openVerbPicker(path, block);
          }}, "Install starter verbs"),
    ].filter(Boolean),
  });
}
