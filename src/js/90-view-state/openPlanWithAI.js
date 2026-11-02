function openPlanWithAI(src) {
  if (!src || !trim(src.text)) { notify("Nothing to plan: the line is empty.", "warn"); return; }
  const key = [src.space, src.path, ...src.ids].join("\u0000");
  const projPref = "plan.projects:" + (src.space || "");
  const sendProjects = el("input", {type: "checkbox", style: "width:auto;flex:none;margin:0"});
  sendProjects.checked = PREF.get(projPref, "1") === "1";
  const promptBox = el("textarea", {rows: 9, readonly: "readonly", style: "width:100%;font-family:var(--mono);font-size:12px"});
  const sent = el("div", {class: "hint", style: "text-align:left;margin-top:6px"});
  const answer = el("textarea", {rows: 9, placeholder: "Paste the AI's answer here", style: "width:100%;font-size:12.5px;line-height:1.5"});
  if (PLAN_DRAFT.key === key) answer.value = PLAN_DRAFT.answer;
  answer.addEventListener("input", () => { PLAN_DRAFT = {key, answer: answer.value}; });

  const ai = el("select", {"aria-label": "Your AI", style: "width:auto"});
  const own = planAiOf(src.space);
  const saved = [...planAiSaved(), own].filter((u, i, l) => u && l.indexOf(u) === i && !PLAN_AIS.some(([k]) => k === u));
  const choices = [...PLAN_AIS, ...saved.map(u => [u, planAiName(u)])];
  for (const [u, n] of [...choices, ["\u0001", "Another, by its address…"]]) {
    const o = el("option", {value: u}, n);
    if (u === own) o.selected = true;
    ai.append(o);
  }
  const copyBtn = el("button", {class: "btn ghost"});
  const label = () => { copyBtn.textContent = ai.value ? "Copy and open " + planAiName(ai.value) : "Copy the prompt"; };
  ai.addEventListener("change", () => {
    if (ai.value === "\u0001") {
      promptInput({title: "Your AI", label: "The address of its chat page", value: "https://", cta: "Use it",
        hint: "Opened in a new tab each time you copy a prompt in this area.",
        onSave: url => {
          if (/^https?:\/\/\S+\.\S+/.test(url)) { PREF.set("plan.ai:" + (src.space || ""), url); planAiRemember(url); }
          else notify("That is not a web address: it starts with https://", "warn");
          openPlanWithAI(src);
        }});
      return;
    }
    PREF.set("plan.ai:" + (src.space || ""), ai.value);
    label();
  });
  label();

  const back = el("select", {"aria-label": "How far back", style: "width:auto"});
  for (const [v, n] of PLAN_BACK) {
    const o = el("option", {value: v}, n);
    if (v === planBackOf(src.space)) o.selected = true;
    back.append(o);
  }
  back.addEventListener("change", () => { PREF.set("plan.back:" + (src.space || ""), back.value); draw(); });
  const draw = () => inSpace(src.space, () => {
    const found = src.project ? {list: [], open: 0, old: 0} : planProjectCandidates(src.text, back.value);
    const cands = found.list;
    promptBox.value = planPromptFor(src, sendProjects.checked ? cands : []);
    const looked = "Looked at " + found.open + " active or waiting and " + found.old + " someday or completed. ";
    sent.textContent = src.project ? "It is in the project “" + src.project.title + "”, so no other project names are sent."
      : looked + (!cands.length ? "None looks like it, so no project names are sent."
      : (sendProjects.checked ? "Sent as projects it may be: " : "Not sent: ") + cands.map(c => c.title).join(", "));
  });
  sendProjects.addEventListener("change", () => { PREF.set(projPref, sendProjects.checked ? "1" : "0"); draw(); });
  draw();

  const copy = async () => {
    try { await navigator.clipboard.writeText(promptBox.value); }
    catch (_) { promptBox.focus(); promptBox.select(); notify("The browser would not copy it: press Ctrl+C, the prompt is selected.", "warn"); return; }
    notify("Copied " + promptBox.value.length.toLocaleString() + " characters. Paste it into " +
      (ai.value ? planAiName(ai.value) : "your AI") + ", then its answer here.");
    if (ai.value) window.open(ai.value, "_blank", "noopener");
  };
  modal({
    center: true, title: "Plan it with an AI",
    body: el("div", {},
      el("div", {class: "field"}, el("label", {}, "1. Copy this to your AI"), promptBox),
      el("div", {class: "field", style: "margin-top:-6px;font-size:13px"},
        src.project ? null : el("label", {style: "display:flex;gap:6px;align-items:center;text-transform:none;" +
          "letter-spacing:normal;font-size:13px;color:var(--fg)"}, sendProjects,
          "Send the names of projects it may already be"),
        src.project ? null : el("div", {style: "display:flex;gap:8px;align-items:center;margin-top:6px;flex-wrap:wrap"},
          el("span", {class: "hint"}, "Active and waiting projects are always looked at. Someday and completed ones from:"), back),
        sent,
        el("div", {style: "display:flex;gap:8px;align-items:center;margin-top:8px;flex-wrap:wrap"},
          el("span", {class: "hint"}, "Your AI in this area:"), ai, copyBtn)),
      el("div", {class: "field"}, el("label", {}, "2. Paste its answer here"), answer)),
    foot: [
      el("button", {class: "btn ghost", onclick: () => openPlanTemplate(src)}, "Edit the prompt"),
      el("div", {style: "flex:1"}),
      el("button", {class: "btn ghost", onclick: closeModal}, "Close"),
      el("button", {class: "btn primary", onclick: () => {
        if (!applyPlanAnswer(src, answer.value)) return;
        PLAN_DRAFT = {key: "", answer: ""};
        closeModal();
      }}, src.project ? "Add to the project" : "Make the project"),
    ],
  });
  copyBtn.addEventListener("click", copy);
}
