function openPlanTemplate(src) {
  const box = el("textarea", {rows: 18, style: "width:100%;font-family:var(--mono);font-size:12px"});
  box.value = planTemplate(src.space);
  const save = async () => {
    try { await planTemplateWrite(src.space, box.value); }
    catch (e) { notify(e.message || String(e), "warn"); return; }
    notify("Saved. This area uses it from now on.");
    openPlanWithAI(src);
  };
  modal({
    center: true, title: "The prompt",
    body: el("div", {class: "field"}, box,
      el("div", {class: "hint", style: "text-align:left;margin-top:6px"},
        "Words in { } are filled in each time: {name} you, {contexts} this area's contexts, {people} the people and " +
        "organisations the text names, {project} the project the lines are in, {projects} projects it may already be, " +
        "{text} the lines or the email. Kept in 8/Prompts/GTD project.md in this area. " +
        "The answer is read by its first line (the project name), the lines starting Stakeholders, Purpose, Vision " +
        "and Decide, and its TODO and WAIT lines.")),
    foot: [
      el("button", {class: "btn ghost", onclick: () => openPlanWithAI(src)}, "Back"),
      el("button", {class: "btn ghost", onclick: () => { box.value = PLAN_PROMPT_DEFAULT; }}, "The standard one"),
      el("div", {style: "flex:1"}),
      el("button", {class: "btn primary", onclick: save}, "Save"),
    ],
  });
}
