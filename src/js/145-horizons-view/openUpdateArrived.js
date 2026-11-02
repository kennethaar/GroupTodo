function openUpdateArrived(data) {
  // The reply does not say when; it is answered as it arrives.
  const at = nowStamp();

  const rows = [], askedOf = new Map();
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
    const closed = inSpace(hit.space, () => !OPEN_STATES[hit.block.state]);
    /* Got it, on the update you sent them. "2 done" on a task you only told
       them about is the same: it is yours to close, not theirs. */
    if (item.ack || (item.numbered && item.done && !item.answered && !inSpace(hit.space, () => blockProp(hit.block, ASKED_PROP)))) {
      if (!rows.some(r => r.ack && r.hit.block === hit.block)) rows.push({hit, ack: true, done: false, note, closed, take: true});
      continue;
    }
    if (!item.done && !note) continue;                  // no answer is not news
    rows.push({hit, done: !!item.done, answered: !!item.answered, note, closed, take: true});
  }
  const who = [...askedOf].sort((x, y) => y[1] - x[1])[0]?.[0] || trim(data.from) || "They";
  /* Words in the reply with no number on them: yours to place, on one of the
     tasks the mail was about. With only one, they are about that one. */
  const hits = (data.refs || []).map(ref => resolveReplyItem({ref})).filter(Boolean);
  const loose = trim(data.loose || "") && hits.length ? {note: trim(data.loose), hits, at: hits.length === 1 ? 0 : -1} : null;

  if (!rows.length && !loose) {
    modal({center: true, title: who + " replied", body: el("div", {},
      el("div", {class: "field"}, el("div", {style: "color:var(--fg2);font-size:13.5px;line-height:1.6"},
        gone ? "Nothing in the reply matches a task that is still here. " +
               gone + " of the lines point at tasks that have since been deleted or renamed past recognition."
             : "They sent it back without ticking anything or writing a note. " +
               "Everything is still open, which is itself an answer."))),
      foot: [el("button", {class: "btn primary", onclick: closeModal}, "Close")]});
    return;
  }

  const list = el("div", {style: "max-height:46vh;overflow:auto"});
  const counts = el("div", {style: "color:var(--fg3);font-size:12.5px;margin-top:8px"});
  /* On a line they say is done or answered, the tick is whether it closes:
     what they wrote is filed either way, since it is their answer. On a
     comment alone, or a task already closed here, it is whether the comment goes. */
  const closable = r => r.done && !r.closed;
  const closes = r => closable(r) && r.take;
  const files = r => !!r.note && (r.take || closable(r));
  /* A question they answered that you keep open is yours again: it comes back
     as a to-do of yours unless you say it should go on waiting on them. */
  const waiting = r => inSpace(r.hit.space, () => r.hit.block.state === "WAIT");
  const mayReturn = r => r.answered && closable(r) && !r.take && waiting(r);
  const returns = r => mayReturn(r) && r.back;
  // Got it is stamped on the task, acknowledged:: who and when.
  const acks = r => r.ack && r.take;
  const places = () => !!loose && loose.at >= 0;
  for (const r of rows) r.back = true;
  const refresh = () => {
    const n = rows.filter(closes).length, notes = rows.filter(files).length + (places() ? 1 : 0),
      back = rows.filter(returns).length, seen = rows.filter(acks).length,
      taken = rows.filter(r => closes(r) || files(r) || acks(r)).length + (places() ? 1 : 0);
    counts.textContent = n + (n === 1 ? " task closes, " : " tasks close, ") +
      (back ? back + " back to you, " : "") + (seen ? seen + " got it, " : "") +
      notes + (notes === 1 ? " comment filed." : " comments filed.");
    apply.textContent = taken ? "Apply " + taken : "Apply nothing";
  };

  for (const r of rows) {
    const title = inSpace(r.hit.space, () => plainTitle(r.hit.block.title));
    const said = r.answered ? "answered" : "they say done";
    const what = () => (r.ack ? (r.take ? "got it · marked as seen by " + firstNameOf(who) : "got it · not marked") +
        (r.note ? ", the comment is filed" : "")
      : !r.done ? "comment only · stays open"
      : r.closed ? said + " · already closed here"
      : r.take ? said + " → close it"
      : mayReturn(r) ? said + (r.back ? " · back to you as a to-do" : " · keeps waiting on " + firstNameOf(who)) +
        ", the answer is filed"
      : said + " · stays open" + (r.note ? ", " + (r.answered ? "the answer" : "the comment") + " is filed" : "")) +
      " · " + r.hit.path;
    const line = el("div", {style: "color:var(--fg3);font-size:12px;margin-top:2px"}, what());
    const state = el("span", {class: "state"});
    const whose = el("div", {class: "statefilter", style: "margin-top:6px"});
    const draw = () => {
      line.textContent = what();
      const st = closes(r) || acks(r) ? "DONE" : returns(r) ? "TODO" : "WAIT";
      state.className = "state " + st;
      state.textContent = closes(r) ? "done" : acks(r) ? "got it" : returns(r) ? "yours" : "open";
      whose.style.display = mayReturn(r) ? "" : "none";
      whose.replaceChildren(...[[true, "Back to you as TODO"], [false, "Keep waiting on " + firstNameOf(who)]]
        .map(([v, label]) => el("button", {class: "chip filter" + (r.back === v ? " on" : ""),
          onclick: () => { r.back = v; draw(); refresh(); }}, (r.back === v ? "✓ " : "") + label)));
    };
    const box = el("button", {class: "spacetoggle on", onclick: () => {
      r.take = !r.take;
      box.className = "spacetoggle" + (r.take ? " on" : "");
      box.textContent = r.take ? "✓" : "";
      draw();
      refresh();
    }}, "✓");
    draw();
    list.append(el("div", {style: "display:flex;gap:10px;align-items:flex-start;margin:9px 0"},
      box,
      el("div", {style: "min-width:0;flex:1"},
        el("div", {}, title),
        r.note ? el("div", {style: "color:var(--fg2);font-size:12.5px;font-style:italic;margin-top:2px"},
          "“" + r.note + "”") : null,
        line, whose),
      state));
  }
  if (loose) {
    const sel = el("select", {style: "margin-top:6px", onchange: () => { loose.at = +sel.value; refresh(); }},
      el("option", {value: "-1"}, "Leave it out"),
      ...loose.hits.map((h, i) => el("option", {value: String(i)}, inSpace(h.space, () => plainTitle(h.block.title)))));
    sel.value = String(loose.at);
    list.append(el("div", {style: "display:flex;gap:10px;align-items:flex-start;margin:9px 0"},
      el("span", {style: "width:22px;flex:0 0 auto"}),
      el("div", {style: "min-width:0;flex:1"},
        el("div", {style: "color:var(--fg2);font-size:12.5px;font-style:italic"}, "“" + loose.note + "”"),
        el("div", {style: "color:var(--fg3);font-size:12px;margin-top:2px"}, "No number on it: which task is it about?"),
        sel)));
  }

  const apply = el("button", {class: "btn primary", onclick: () => {
    let closed = 0, noted = 0, back = 0, seen = 0;
    if (places()) {
      const h = loose.hits[loose.at];
      inSpace(h.space, () => { if (postMessageAs(h.path, h.block, loose.note, who, at)) noted++; touch(h.path); });
    }
    for (const r of rows) {
      if (!closes(r) && !files(r) && !acks(r)) continue;
      inSpace(r.hit.space, () => {
        if (acks(r)) { setBlockProp(r.hit.block, ACK_PROP, who + " " + at); seen++; touch(r.hit.path); }
        if (r.ack) { if (files(r) && postMessageAs(r.hit.path, r.hit.block, r.note, who, at)) noted++; return; }
        if (closes(r)) { closeOnTheirWord(r.hit.path, r.hit.block, who, at); closed++; }
        if (returns(r)) {
          r.hit.block.state = "TODO";
          dropProp(r.hit.block, ASSIGN_PROP);
          dropProp(r.hit.block, "assigned_at");
          back++;
        }
        if (files(r) && postMessageAs(r.hit.path, r.hit.block, r.note, who, at)) noted++;
        // They answered, so there is no longer an unanswered question to chase.
        dropProp(r.hit.block, ASKED_PROP);
        touch(r.hit.path);
      });
    }
    closeModal();
    notify(who + "'s update is in: " + closed + " closed, " + (back ? back + " back to you, " : "") + (seen ? seen + " got it, " : "") + noted +
           (noted === 1 ? " comment." : " comments."));
    render();
  }});
  refresh();

  modal({
    center: true, title: who + " replied",
    hint: formatStamp(at),
    body: el("div", {},
      el("div", {class: "field"},
        el("label", {}, "What this will change"),
        list, counts),
      gone ? el("div", {class: "field"},
        el("div", {style: "color:var(--fg3);font-size:12.5px"},
          gone + (gone === 1 ? " line" : " lines") + " in the reply point at tasks that are " +
          "no longer here, so there is nothing to apply them to.")) : null,
      el("div", {class: "field"},
        el("div", {style: "color:var(--fg3);font-size:12.5px"},
          "Their notes are filed as comments on the tasks, in their name - so the thread " +
          "reads like they said it, because they did."))),
    foot: [
      el("button", {class: "btn ghost", onclick: closeModal}, "Cancel"),
      apply,
    ],
  });
}
