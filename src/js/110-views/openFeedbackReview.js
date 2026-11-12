/* One piece of feedback at a time, with what it is about beside it, and no
   way on but an outcome (#285). Edit and Reply leave it open where it was.
   Ending something that still has open work under it asks first; nothing
   else does. */
function openFeedbackReview(items = feedbackQueue(), at = 0, step = null) {
  while (at < items.length && isHandled(items[at].msg)) at++;
  const f = items[at];
  if (!f) {
    acrossSpaces(() => {
      const since = lastSeen();
      if (since && !newsSince(since).some(n => n.kind === "said" && !isHandled(n.msg))) markSeen();
      return [];
    });
    render();
    modal({center: true, title: "Feedback",
      body: el("div", {class: "field"}, "You're caught up."),
      foot: [el("button", {class: "btn primary", onclick: closeModal}, "Close")]});
    return;
  }
  const again = s => openFeedbackReview(items, at, s);
  /* An outcome can ask a question of its own -- the project that just ran
     out of steps -- and the review waits for it. */
  let shown = null;
  const onward = () => {
    render();
    if (shown && shown.root.isConnected) openFeedbackReview(items, at + 1);
    else askAfterModal(() => openFeedbackReview(items, at + 1));
  };
  const s = feedbackSubject(f);
  const project = s.kind === "project";
  const {title, status, next, due, openUnder} = inSpace(f.space, () => {
    const path = project ? s.project : f.path;
    const nx = project ? projectNextAction(path) : null;
    const pageOpen = [];
    if (project) walkBlocks((getPage(path) || {}).blocks || [], b => { if (b !== f.block && OPEN_STATES[b.state]) pageOpen.push(b); });
    return {
      title: project ? pageTitle(path) : plainTitle(f.block.title),
      status: project ? STATUS_LABEL[statusDirOf(path)] || "" : (INFORM_STATES.find(x => x[0] === f.block.state) || [])[1] || "",
      next: nx, due: dueDate(project ? nx || {} : f.block) || "",
      openUnder: project ? pageOpen.length : (f.block.children || []).filter(c => OPEN_STATES[c.state]).length,
    };
  });
  const decide = (outcome, extra) => {
    if (!decideFeedback(f, outcome, extra)) { notify("Write the next action first.", "warn"); return; }
    onward();
  };
  const foot = [];
  let body;
  if (step === "continue" || step === "keep" || step === "takeback") {
    const own = step !== "continue", said = outcomeLabel(f, step);
    const text = el("input", {type: "text", value: own ? f.block.title : next ? next.title : "",
      placeholder: "Call Anna about the quote", "aria-label": own ? "The to-do" : "Next action"});
    const date = el("input", {type: "date", value: own ? due : next ? due : "", "aria-label": "Due"});
    body = el("div", {},
      el("div", {class: "field"}, el("b", {}, own ? said : "Continue the project")),
      el("div", {class: "field"}, el("label", {}, own ? "To-do" : "Next action"), text),
      el("div", {class: "field"}, el("label", {}, "Due"), date));
    foot.push(el("button", {class: "btn ghost", onclick: () => again(null)}, "Back"),
      el("div", {style: "flex:1"}),
      el("button", {class: "btn primary", onclick: () => decide(step, {next: text.value, due: date.value})}, said + " and next"));
    setTimeout(() => text.focus(), 50);
  } else if (step) {
    const verb = OUTCOME_ASK[step] || OUTCOME_LABEL[step];
    body = el("div", {},
      el("div", {class: "field"}, el("b", {}, verb + (project ? " project?" : " to-do?"))),
      el("div", {class: "field"}, title),
      el("div", {class: "field fbnote"}, openUnder + (openUnder === 1 ? " open task stays " : " open tasks stay ") +
        (project ? "with the project." : "under it.")));
    foot.push(el("button", {class: "btn ghost", onclick: () => again(null)}, "Back"),
      el("div", {style: "flex:1"}),
      el("button", {class: "btn primary", onclick: () => decide(step)}, verb + " and next"));
  } else {
    const reply = el("div", {class: "field", hidden: true});
    const words = el("textarea", {rows: 3, "aria-label": "Your reply to " + f.who});
    reply.append(words, el("div", {class: "fbrow"}, el("button", {class: "btn primary sm", onclick: () => {
      if (!trim(words.value)) return;
      inSpace(f.space, () => postMessage(f.path, f.block, linkKnownNames(words.value)));
      notify("Reply posted on the task.");
      again(null);
    }}, "Send")));
    const ask = o => {
      if (o === "continue" || o === "keep" || o === "takeback") return again(o);
      if (OUTCOME_ASK[o] && openUnder) return again(o);
      decide(o);
    };
    body = el("div", {},
      el("div", {class: "field"}, el("b", {}, f.who),
        el("blockquote", {class: "fbquote", translate: "no", html: renderInline(f.text)}),
        project ? el("div", {class: "fbnote"}, "On “" + inSpace(f.space, () => plainTitle(f.block.title)) + "”") : null),
      el("div", {class: "field fbitem"},
        el("label", {}, project ? "Project" : "To-do"),
        el("div", {class: "fbtitle"}, title),
        el("div", {class: "fbnote"}, "Status: " + (status || "Open")),
        project ? el("div", {class: "fbnote"}, next ? "Next action: " + plainTitle(next.title) : "No next action")
          : due ? el("div", {class: "fbnote"}, "Due " + humanDate(due)) : null),
      el("div", {class: "field fbrow"},
        el("button", {class: "btn ghost sm", onclick: () => {
          inSpace(f.space, () => showTaskDetail(f.path, f.block, f.space));
          MODAL_AFTER = () => askAfterModal(() => again(null));
        }}, "Edit"),
        el("button", {class: "btn ghost sm", onclick: () => { reply.hidden = false; words.focus(); }}, "Reply")),
      reply,
      el("div", {class: "field"}, el("label", {}, "Outcome"),
        el("div", {class: "fbrow"}, ...feedbackOutcomes(f).map(o =>
          el("button", {class: "btn", onclick: () => ask(o)}, outcomeLabel(f, o))))));
  }
  shown = modal({center: true, title: "Feedback", hint: (at + 1) + " of " + items.length, body, foot: foot.length ? foot : null});
}
