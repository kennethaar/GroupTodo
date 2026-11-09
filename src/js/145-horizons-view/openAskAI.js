/* Let AI write it (#344), for one line or a whole ask: the prompt to copy to
   your AI, and its answer pasted back onto the tasks. done(result) runs after
   Use it, and done(null) after Back, so the dialog it came from opens again. */
function openAskAI(name, entries, done = null) {
  const space = entries[0]?.space || V.space;
  const promptBox = el("textarea", {rows: 6, readonly: "readonly", "aria-label": "The prompt",
    style: "width:100%;font-family:var(--mono);font-size:12px"});
  promptBox.value = askAiPrompt(entries, name, space);
  const answer = el("textarea", {rows: 8, placeholder: "Paste the AI's answer here", "aria-label": "The AI's answer",
    style: "width:100%;font-size:12.5px;line-height:1.5"});
  const again = () => openAskAI(name, entries, done);
  const {select, button} = aiPicker(space, promptBox, again);
  const back = () => { closeModal(); if (done) done(null); };
  const use = () => {
    const r = askAiApply(entries, answer.value);
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
  const many = entries.length > 1;
  modal({
    center: true, title: many ? "Let AI write the questions" : "Let AI write the question",
    hint: many ? entries.length + " lines to " + name : name,
    body: el("div", {},
      el("div", {class: "field"}, el("label", {}, "1. Copy this to your AI"), promptBox,
        el("div", {style: "display:flex;gap:8px;align-items:center;margin-top:8px;flex-wrap:wrap"},
          el("span", {class: "hint"}, "Your AI in this area:"), select, button),
        el("div", {class: "hint", style: "text-align:left;margin-top:6px"},
          "It has " + (many ? "these tasks" : "this task") + " and the project page" + (many ? "s" : "") + " with your notes. Nothing leaves this app " +
          "unless you paste it. " + name + " gets only the question and summary.")),
      el("div", {class: "field"}, el("label", {}, "2. Paste its answer here"), answer,
        el("div", {class: "hint", style: "text-align:left;margin-top:6px"},
          "The words go on the task" + (many ? "s" : "") + ", to check and change before you send."))),
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
