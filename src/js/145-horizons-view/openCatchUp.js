/* Catch up with an AI (#516), from Get current in the Weekly review: 1. copy
   the prompt to an AI that reads your mail, chats and meetings; 2. paste its
   answer. Read it lists the changes to tick (catchUpReview). */
function openCatchUp() {
  const src = catchUpSource();
  if (CATCHUP_DRAFT.space !== V.space || !CATCHUP_DRAFT.refs) CATCHUP_DRAFT = {space: V.space, answer: "", refs: null};
  const promptBox = el("textarea", {rows: 8, "aria-label": "The prompt",
    style: "width:100%;font-family:var(--mono);font-size:12px"});
  promptBox.value = src.text;
  const answer = el("textarea", {rows: 8, placeholder: "Paste the AI's answer here", "aria-label": "The AI's answer",
    style: "width:100%;font-size:12.5px;line-height:1.5"});
  answer.value = CATCHUP_DRAFT.answer;
  // The answer reads by the references of the prompt it was copied with.
  let refs = CATCHUP_DRAFT.refs || src.refs;
  answer.addEventListener("input", () => { CATCHUP_DRAFT = {space: V.space, answer: answer.value, refs}; });
  const {select: ai, button: copyBtn} = aiPicker(V.space, promptBox, openCatchUp);
  copyBtn.addEventListener("click", () => { refs = src.refs; CATCHUP_DRAFT = {space: V.space, answer: answer.value, refs}; });
  modal({
    center: true, title: "Catch up with an AI",
    body: el("div", {},
      el("div", {class: "field"}, el("label", {}, "1. Copy this to an AI that reads your mail and meetings"), promptBox),
      el("div", {class: "field", style: "display:flex;gap:8px;align-items:center;margin-top:-6px;flex-wrap:wrap"},
        el("span", {class: "hint"}, "Your AI in this area:"), ai, copyBtn),
      el("div", {class: "field"}, el("label", {}, "2. Paste its answer here"), answer)),
    foot: [
      el("button", {class: "btn ghost", onclick: closeModal}, "Close"),
      el("button", {class: "btn primary", onclick: () => {
        const rows = parseCatchUp(answer.value, refs);
        if (!rows.length) {
          notify(trim(answer.value) ? "No changes in that. Paste the AI's lines that start with DONE, DUE, NOTE, NEXT, WAIT or PROJECT."
            : "Paste the AI's answer first.", "warn");
          answer.focus();
          return;
        }
        catchUpReview(rows);
      }}, "Read it"),
    ],
  });
}
