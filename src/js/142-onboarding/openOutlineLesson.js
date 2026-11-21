/* The last step of starting your own: how lines inside lines work, as four
   short rules played on one small outline (#468). A line under another gets
   its project, people and date; the top line gathers the to-dos under it;
   and Next shows the deepest open step only. after runs once it is closed. */
function openOutlineLesson(after) {
  const rules = OUTLINE_LESSON.rules;
  const head = el("div", {class: "olhead", "aria-live": "polite"});
  const box = el("div", {class: "olbox-outline", "aria-hidden": "true"});
  let step = 0, done = false;
  const finish = () => { if (done) return; done = true; box._olRun = -1; if (after) after(); };
  const dots = rules.map((r, i) => el("button", {class: "oldot", type: "button",
    "aria-label": "Rule " + (i + 1) + ": " + r, onclick: () => show(i)}));
  const back = el("button", {class: "btn ghost", onclick: () => show(step - 1)}, "Back");
  const next = el("button", {class: "btn primary", onclick: () => {
    if (step < rules.length - 1) { show(step + 1); return; }
    closeModal(); finish();
  }}, "Next");
  function show(i) {
    step = Math.max(0, Math.min(rules.length - 1, i));
    head.textContent = rules[step];
    dots.forEach((d, j) => { d.classList.toggle("on", j === step); d.setAttribute("aria-current", j === step ? "step" : "false"); });
    back.disabled = step === 0;
    next.textContent = step === rules.length - 1 ? "Got it" : "Next";
    outlineLessonPlay(box, step);
  }
  modal({
    center: true, title: "Lines inside lines",
    body: el("div", {class: "ollesson"}, head, box),
    foot: [el("div", {class: "oldots"}, dots), back, next],
    onKey: e => {
      if (e.key === "ArrowRight") { show(step + 1); return true; }
      if (e.key === "ArrowLeft") { show(step - 1); return true; }
      return false;
    },
    onClose: finish,
  });
  show(0);
  setTimeout(() => next.focus(), 30);
}
