/* Settings -> Language. Which one this device shows, and the two ways to get
   another: a file somebody shared on GitHub, or translating it yourself. */
function openLanguageDialog() {
  const cur = PREF.get("lang", "") || LANG_BASE;
  const sel = el("select", {"aria-label": "Language"},
    ...langNames().map(n => el("option", {value: n, selected: n === cur ? "" : null}, n)));
  sel.addEventListener("change", () => { langChoose(sel.value); openLanguageDialog(); });
  const c = langCount(cur);
  const hint = text => el("div", {class: "hint", style: "text-align:left;margin-top:6px"}, text);
  const thisOne = el("div", {class: "field"},
    el("label", {}, cur === LANG_BASE ? "The English words" : "This language"),
    cur === LANG_BASE
      ? hint("Change a word the app uses by writing your own after => in English.md.")
      : hint(c.done + " of " + c.all + " lines translated. What is not translated shows in English."),
    el("div", {style: "display:flex;gap:8px;flex-wrap:wrap;margin-top:8px"},
      el("button", {class: "btn ghost", onclick: () => openLanguageEditor(cur)}, "Edit translations"),
      cur === LANG_BASE ? null : el("button", {class: "btn ghost", onclick: () => copyLanguageForAI(cur)}, "Copy for an AI"),
      cur === LANG_BASE ? null : el("button", {class: "btn ghost", onclick: () => openLanguagePaste(cur)}, "Paste a translation")));
  modal({
    center: true, title: "Language",
    body: el("div", {},
      el("div", {class: "field"},
        el("label", {}, "Language on this device"), sel,
        hint("The words of the app. What you and others write is never translated. " +
             "The language files are in 8/Languages in this area.")),
      thisOne,
      el("div", {class: "field"},
        el("label", {}, "Add a language"),
        el("div", {style: "display:flex;gap:8px;flex-wrap:wrap"},
          el("button", {class: "btn ghost", onclick: () => openLanguageGitHub()}, "Get one from GitHub"),
          el("button", {class: "btn ghost", onclick: () => openLanguageNew()}, "Translate it yourself")),
        hint("A file from GitHub is one somebody translated and shared. Translating it yourself starts " +
             "a file with every line in English, to fill in here or with an AI."))),
    foot: [el("div", {style: "flex:1"}), el("button", {class: "btn ghost", onclick: closeModal}, "Close")],
  });
}
