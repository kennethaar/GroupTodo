/* Let AI write it (#344), for one line or a whole ask: the prompt to copy to
   your AI, and its answer pasted back onto the tasks. done(result) runs after
   Use it, and done(null) after Back, so the dialog it came from opens again.
   Names are hidden in the prompt unless you turn it off (#345); the prompt
   box can be edited, so anything the hiding missed can be taken out by hand. */
function openAskAI(name, entries, done = null) {
  const space = entries[0]?.space || V.space;
  const hide = PREF.get("askAiHide", "1") === "1";
  const raw = askAiPrompt(entries, name, space);
  // The key from token to name: here, in this dialog, and nowhere else.
  const hidden = hide ? askHide(raw, name) : {text: raw, map: null};
  const promptBox = el("textarea", {rows: 6, "aria-label": "The prompt",
    style: "width:100%;font-family:var(--mono);font-size:12px"});
  promptBox.value = hide ? ASK_HIDE_NOTE + hidden.text : raw;
  const answer = el("textarea", {rows: 8, placeholder: "Paste the AI's answer here", "aria-label": "The AI's answer",
    style: "width:100%;font-size:12.5px;line-height:1.5"});
  const again = () => openAskAI(name, entries, done);
  const {select, button} = aiPicker(space, promptBox, again);
  const back = () => { closeModal(); if (done) done(null); };
  const use = () => {
    const r = askAiApply(entries, answer.value, hidden.map);
    if (r.unknown.length) {
      notify("The answer has " + r.unknown.join(", ") + ", which the prompt did not use. " +
        "Fix " + (r.unknown.length === 1 ? "it" : "them") + " in the answer, then Use it again. Nothing is saved yet.", "warn");
      answer.focus();
      return;
    }
    if (!r.filled && !r.same.length) {
      notify("Paste the AI's answer first. It has Question: under each number.", "warn");
      answer.focus();
      return;
    }
    closeModal();
    render();
    notify((r.filled === 1 ? "1 task has its question now" : r.filled + " tasks have their questions now") +
      (r.same.length ? ", and " + r.same.length + " the same as another " + (r.same.length === 1 ? "is" : "are") + " left out." : "."));
    if (done) done(r);
  };

  const hideBox = el("input", {type: "checkbox"});
  hideBox.checked = hide;
  hideBox.addEventListener("change", () => { PREF.set("askAiHide", hideBox.checked ? "1" : "0"); again(); });
  /* Names the app could not know, offered to hide: a click puts one on
     Hidden names in this area and makes the prompt again. */
  const maybe = hide ? askHideSuggest(hidden.text) : [];
  const hideRow = el("div", {class: "field"},
    el("label", {style: "display:flex;gap:8px;align-items:center;font-weight:normal"}, hideBox,
      "Hide names: people, organisations, email addresses and phone numbers"),
    el("div", {class: "hint", style: "text-align:left;margin-top:4px"},
      hide ? "They go as [P1], [O1] and so on, and come back in the answer. What the work is about still goes along, " +
             "so take out by hand anything more in the box below."
           : "The prompt goes with every name in it."),
    maybe.length ? el("div", {style: "margin-top:8px"},
      el("div", {class: "hint", style: "text-align:left;margin-bottom:4px"}, "Hide these too? They look like names:"),
      el("div", {class: "opts"},
        ...maybe.map(w => el("button", {class: "fchip", onclick: () => { inSpace(space, () => askHideAdd(w)); again(); }}, w)))) : null,
    hide ? el("button", {class: "btn sm ghost", style: "margin-top:8px", onclick: () => {
      closeModal();
      openPage(inSpace(space, askHideEnsure));
    }}, "Edit Hidden names") : null);

  const many = entries.length > 1;
  modal({
    center: true, title: many ? "Let AI write the questions" : "Let AI write the question",
    hint: many ? entries.length + " lines to " + name : name,
    body: el("div", {},
      hideRow,
      el("div", {class: "field"}, el("label", {}, "1. Copy this to your AI"), promptBox,
        el("div", {style: "display:flex;gap:8px;align-items:center;margin-top:8px;flex-wrap:wrap"},
          el("span", {class: "hint"}, "Your AI in this area:"), select, button),
        el("div", {class: "hint", style: "text-align:left;margin-top:6px"},
          "It has " + (many ? "these tasks" : "this task") + " and the project page" + (many ? "s" : "") + " with your notes. " +
          "Edit it freely before you copy. Nothing leaves this app unless you paste it. " +
          name + " gets only the question and summary.")),
      el("div", {class: "field"}, el("label", {}, "2. Paste its answer here"), answer,
        el("div", {class: "hint", style: "text-align:left;margin-top:6px"},
          "The words go on the task" + (many ? "s" : "") + ", with the names back, to check and change before you send."))),
    foot: [
      el("button", {class: "btn ghost", onclick: () => openPromptEditor({space, path: ASK_PROMPT_PATH,
        standard: ASK_PROMPT_DEFAULT, back: again,
        hint: "{person} is who you ask, {language} the language of the note, {items} the project pages and then the numbered tasks. " +
          "Kept in 8/Prompts/Update questions.md in this area. The answer is read by its numbers and the lines " +
          "Question:, Summary:, Why: and Same as: under each."})}, "Edit the prompt"),
      el("div", {style: "flex:1"}),
      el("button", {class: "btn ghost", onclick: back}, "Back"),
      el("button", {class: "btn primary", onclick: use}, "Use it"),
    ],
  });
}
