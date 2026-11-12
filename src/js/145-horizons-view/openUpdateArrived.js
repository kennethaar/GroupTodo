/* Their reply is feedback, so it is filed and then reviewed one item at a time
   (#285). Nothing closes on their word alone: "done" is filed as what they
   said, and the outcome is yours to choose in the review. Got it is not
   feedback: it is stamped on the task as acknowledged:: and needs no answer. */
function openUpdateArrived(data) {
  // The reply does not say when; it is answered as it arrives.
  const at = nowStamp();

  const said = [], askedOf = new Map();
  let gone = 0;
  for (const item of data.items) {
    const hit = resolveReplyItem(item);
    if (!hit) { gone++; continue; }
    /* Who answered is whoever the tasks are waiting on, which the tasks
       already say. Mostly one name; if not, the one most of them name. */
    // A question is your own task, so it is nobody's but yours: the person it
    // names is who was asked.
    const owner = leafActions().find(a => a.block === hit.block)?.assignee ||
      peopleOnLine(hit.block).find(n => !samePerson(n, whoAmI()));
    if (owner) askedOf.set(owner, (askedOf.get(owner) || 0) + 1);
    const note = trim(item.note || "");
    /* Got it, on the update you sent them. "2 done" on a task you only told
       them about is the same: it is yours to close, not theirs. */
    const ack = item.ack || (item.numbered && item.done && !item.answered && !inSpace(hit.space, () => blockProp(hit.block, ASKED_PROP)));
    if (ack && !said.some(r => r.ack && r.hit.block === hit.block)) said.push({hit, ack: true, note});
    else if (!ack && (note || item.done)) said.push({hit, note: note || "Done."});
  }
  // who: the person you said it is from, when the reply did not say (#373).
  const who = trim(data.who || "") || [...askedOf].sort((x, y) => y[1] - x[1])[0]?.[0] || trim(data.from) || "They";
  /* Words in the reply with no number on them: yours to place, on one of the
     tasks the mail was about. With only one, they are about that one. */
  const hits = (data.refs || []).map(ref => resolveReplyItem({ref})).filter(Boolean);
  const loose = trim(data.loose || "") && hits.length ? trim(data.loose) : "";

  if (!said.length && !loose) {
    modal({center: true, title: who + " replied", body: el("div", {},
      el("div", {class: "field"}, el("div", {style: "color:var(--fg2);font-size:13.5px;line-height:1.6"},
        gone ? "Nothing in the reply matches a task that is still here. " +
               gone + " of the lines point at tasks that have since been deleted or renamed past recognition."
             : "They sent it back without ticking anything or writing a note. " +
               "Everything is still open, which is itself an answer."))),
      foot: [el("button", {class: "btn primary", onclick: closeModal}, "Close")]});
    return;
  }

  // Their words go on the tasks in their name, so the thread reads like they said it.
  const review = [];
  let seen = 0;
  const file = (hit, note) => inSpace(hit.space, () => {
    const msg = postMessageAs(hit.path, hit.block, note, who, at);
    touch(hit.path);
    if (msg) review.push({space: hit.space || V.space, path: hit.path, block: hit.block, msg, who, at, text: msg.title});
  });
  for (const r of said) {
    if (r.ack) inSpace(r.hit.space, () => { setBlockProp(r.hit.block, ACK_PROP, who + " " + at); touch(r.hit.path); seen++; });
    if (r.note) file(r.hit, r.note);
  }
  const start = () => {
    notify(who + "'s reply is in: " + (review.length === 1 ? "1 comment" : review.length + " comments") + " to review" +
      (seen ? ", " + seen + " got it" : "") +
      (gone ? ". " + gone + (gone === 1 ? " line points" : " lines point") + " at tasks that are no longer here." : "."));
    render();
    if (review.length) openFeedbackReview(review);
  };
  if (!loose || hits.length === 1) {
    if (loose) file(hits[0], loose);
    start();
    return;
  }
  listPicker({
    title: "Which task is this about?", hint: "“" + loose + "”",
    items: hits, label: h => inSpace(h.space, () => plainTitle(h.block.title)),
    onPick: h => { file(h, loose); start(); },
    footer: el("button", {class: "btn ghost", onclick: () => { closeModal(); start(); }}, "Leave it out"),
  });
}
