function newChecklistPrompt() {
  const nameInput = el("input", {placeholder: "Weekly accounts"});
  const tplNote = el("div", {class: "field"},
    el("div", {style: "color:var(--fg2);font-size:12.5px;line-height:1.5"},
      "Write %name% wherever the thing you are onboarding should appear - " +
      "\"Call %name% to welcome them\". You are asked for it on every run."));
  const hints = {
    routine: "comes back and never finishes - run it when it is due",
    plain: "steps you would rather not think through twice; run them into today or a project",
    project: "every run spins up a whole new project with these steps",
  };
  let kind = "plain";
  const seg = el("div", {class: "seg"});
  const sync = () => {
    for (const x of seg.children) x.classList.toggle("on", x.dataset.k === kind);
    const h = $("#ckHint"); if (h) h.textContent = hints[kind];
    tplNote.style.display = kind === "project" ? "" : "none";
  };
  for (const [k, label] of [["routine", "Routine"], ["plain", "Checklist"], ["project", "Project template"], ["states", "Task type"]]) {
    // A task type asks different questions, so it has its own dialog.
    const btn = el("button", {onclick: () => {
      if (k === "states") { closeModal(); newStateListPrompt(p => openPage(p), trim(nameInput.value)); return; }
      kind = k; sync(); }}, label);
    btn.dataset.k = k;
    seg.append(btn);
  }
  modal({
    center: true, title: "Something you do again",
    body: el("div", {},
      el("div", {class: "field"},
        el("div", {style: "color:var(--fg2);font-size:13px"}, "A project finishes. A routine comes back. A template makes projects.")),
      el("div", {class: "field"}, el("label", {}, "Name"), nameInput),
      el("div", {class: "field"}, el("label", {}, "Which of the three"), seg,
        el("div", {id: "ckHint", style: "color:var(--fg3);font-size:12px;margin-top:6px"}, hints.plain)),
      tplNote),
    foot: [
      el("button", {class: "btn ghost", onclick: closeModal}, "Cancel"),
      el("button", {class: "btn primary", onclick: () => {
        const t = trim(nameInput.value);
        if (!t) return;
        closeModal();
        const path = createChecklist(t, kind === "plain" ? null : kind);
        openPage(path);
        // When it comes round is asked in the same dialog its pill opens.
        if (kind === "routine") { PREF.set("madeRoutine", "1"); openRoutineSchedule(path); }
      }}, "Create"),
    ],
  });
  sync();
  setTimeout(() => nameInput.focus(), 30);
}
