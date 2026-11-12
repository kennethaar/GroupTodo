/* only: a line to start with ticked by itself -- the line a name was rested
   on, or the line menu's -- with the rest of theirs there to add.
   keep: {picked: [blocks]}, the lines ticked when the dialog was left for
   the AI, ticked again on the way back (#344). */
function openAskForUpdate(name, only = null, keep = null) {
  const me = whoAmI();
  if (!me) { notify("Put your name in first - the message has to say who is asking.", "warn"); return; }
  /* Two kinds of line go to the same person: what they owe you, and your own
     tasks that name them -- the questions. Both are in one mail unless you
     would rather keep the questions apart from the chasing. A question once
     asked waits on them, and still names them: it is asked again as a
     question, not chased as something they owe. */
  const waits = waitingOnFrom(name).map(a =>
    peopleOnLine(a.block || a).some(n => samePerson(n, name)) ? Object.assign({}, a, {mention: name}) : a);
  const found = waits.concat(askingAbout(name)
    .filter(a => !waits.some(w => w.block === a.block)));
  if (!found.length) {
    notify("Nothing open with " + name + "'s name on it.", "warn");
    return;
  }
  /* Each line as it will read to them: a question under what it is about,
     and questions about the same thing next to each other. */
  const aboutOf = new Map(found.map(a => [a, askProjectOf(a)]));
  // The question written on the task (#344), asked in place of its own words.
  const ownAsk = a => a.mention && a.block ? trim(blockProp(a.block, ASK_Q_PROP) || "") : "";
  const partOf = a => a.mention
    ? askQuestionParts({title: a.title, project: aboutOf.get(a), context: contextLinesOf(a.block), ask: ownAsk(a)}, name)
    : {subject: "", ask: checkinTaskTitle(a.title, name)};
  const partsOf = new Map(found.map(a => [a, partOf(a)]));
  /* The heading a line goes under (#362): what a question is about, or the
     project of something they owe you. Lines under one heading sit together. */
  const headOf = a => { const {subject, ask} = partsOf.get(a); return subject && ask ? subject : !a.mention ? aboutOf.get(a) || "" : ""; };
  const firstOf = new Map();
  found.forEach((a, i) => { const k = headOf(a); if (k && !firstOf.has(k)) firstOf.set(k, i); });
  const rank = new Map(found.map((a, i) => [a, headOf(a) ? firstOf.get(headOf(a)) : i]));
  found.sort((x, y) => rank.get(x) - rank.get(y));

  const at = only ? found.findIndex(a => a.block === only) : -1;
  const pick = new Set(keep ? found.map((a, i) => keep.picked.includes(a.block) ? i : -1).filter(i => i >= 0)
    : at >= 0 ? [at] : found.map((_, i) => i));
  const area = found[0].space || Spaces.active || "";
  const saved = emailOf(me, area);
  const email = el("input", {type: "email", placeholder: "you@example.com",
    value: saved});
  // The dialog body scrolls; a second scroll inside it only hid lines (#353).
  const card = el("div", {});
  const summary = el("div", {style: "color:var(--fg3);font-size:12.5px;margin-top:8px"});
  const mixed = found.some(a => a.mention) && found.some(a => !a.mention);
  let split = false;
  /* What a line is about goes with it, unless you would rather not share the
     project's name (#161). Remembered for the next ask. */
  const named = {on: PREF.get("askNameProjects", "1") === "1"};
  const refresh = () => {
    const both = mixed && found.some((a, i) => pick.has(i) && a.mention) && found.some((a, i) => pick.has(i) && !a.mention);
    summary.textContent = pick.size
      ? pick.size + (pick.size === 1 ? " line" : " lines") + " go to " + name +
        (both && split ? " in two emails" : "") + ", with the lines under them you leave ticked. " +
        (named.on ? "" : "Their projects are not named. ") +
        "Nothing else about your vault goes with them." +
        (found.some((a, i) => pick.has(i) && a.mention && a.block.state !== "WAIT")
          ? " Your own to-dos among them wait on " + name + " once sent." : "")
      : "Nothing selected yet.";
  };

  /* The lines under each task go along by default, since they are usually what
     makes the question answerable, unless the task has a summary to send
     instead (#344). Each has its own tick, because a note to yourself is not
     always a note for them. */
  const contexts = found.map(a => askContextOf(a, name));
  const ticked = lines => new Set(lines.map((l, j) => l.on ? j : -1).filter(j => j >= 0));
  const ctxPick = contexts.map(ticked);
  const toggle = (on, flip, size = 22) => {
    const box = el("button", {class: "spacetoggle" + (on() ? " on" : ""),
      style: size < 22 ? "width:" + size + "px;height:" + size + "px;font-size:11px;flex:0 0 auto" : "",
      onclick: () => { flip(); box.className = "spacetoggle" + (on() ? " on" : ""); box.replaceChildren(...(on() ? [svgIcon(ICON_CHECK)] : [])); refresh(); }},
      on() ? svgIcon(ICON_CHECK) : null);
    return box;
  };
  /* The question and the summary, written on the task here once and asked the
     same way every time after (#344). Each is saved as you leave its box. */
  const editing = new Set();
  const setAsk = (i, key, value) => {
    const a = found[i];
    inSpace(a.space, () => {
      if (trim(value)) setBlockProp(a.block, key, trim(value)); else dropProp(a.block, key);
      touch(a.path);
    });
    partsOf.set(a, partOf(a));
    contexts[i] = askContextOf(a, name);
    ctxPick[i] = ticked(contexts[i]);
    drawCard();
  };
  const editorFor = (a, i) => {
    const box = (label, key, hint) => {
      const input = el("input", {value: blockProp(a.block, key) || "", placeholder: hint});
      input.addEventListener("change", () => setAsk(i, key, input.value));
      return el("label", {style: "display:block;font-size:12.5px;color:var(--fg2);margin-top:6px"}, label, input);
    };
    return el("div", {style: "margin:4px 0 2px"},
      box("Question to ask " + firstNameOf(name), ASK_Q_PROP, "One sentence they can answer"),
      box("Short summary, sent instead of your notes", ASK_BRIEF_PROP, "What they need to recognise it"),
      el("button", {class: "btn sm ghost", style: "margin-top:6px", onclick: () => toAi([i])}, "Let AI write it"));
  };
  /* Let AI write it (#344): this dialog makes way for the AI's and opens again
     with the same lines ticked, less any the AI found to be the same as another. */
  const toAi = idx => {
    const entries = idx.map(i => found[i]).filter(a => a.block);
    if (!entries.length) { notify("Tick a line to write the question for.", "warn"); return; }
    const picked = found.filter((_, i) => pick.has(i)).map(a => a.block);
    const back = r => {
      const same = new Set((r ? r.same : []).map(j => entries[j].block));
      openAskForUpdate(name, null, {picked: picked.filter(b => !same.has(b))});
    };
    closeModal();
    /* Should the AI's dialog fail on something in the vault, say so and come
       back here, rather than leave you with no dialog at all (#345). */
    try { openAskAI(name, entries, back); }
    catch (e) {
      closeModal();
      back(null);
      notify("Let AI write it could not open: " + (e && e.message || e), "warn");
    }
  };
  const pickRowFor = (a, i) => {
    const box = toggle(() => pick.has(i), () => { if (pick.has(i)) pick.delete(i); else pick.add(i); });
    const d = askedDays(a.block);
    const lines = contexts[i].map((line, j) => el("div", {style: "display:flex;gap:8px;align-items:flex-start;margin:4px 0 0 " + (line.depth * 16) + "px"},
      toggle(() => ctxPick[i].has(j), () => { if (ctxPick[i].has(j)) ctxPick[i].delete(j); else ctxPick[i].add(j); }, 16),
      el("span", {style: "color:var(--fg2);font-size:12.5px;min-width:0"}, line.text)));
    const {subject, ask} = partsOf.get(a);
    return el("div", {style: "display:flex;gap:10px;align-items:flex-start;margin:7px 0"},
      box,
      el("div", {style: "min-width:0;flex:1"},
        el("div", {}, ask || subject),
        el("div", {style: "color:var(--fg3);font-size:12px"},
          [headOf(a) ? null : a.project || baseName(a.path),
           a.age != null ? "open " + a.age + "d" : null,
           d != null ? "asked " + d + "d ago" : "never asked",
           lines.length ? "the lines under it go along unless you untick them" : null,
          ].filter(Boolean).join(" · ")),
        ...lines,
        // A question still in the words you wrote to yourself says so (#344).
        a.block ? el("button", {class: "textbtn", style: "font-size:12.5px;margin-top:4px",
          "aria-expanded": String(editing.has(i)),
          onclick: () => { if (editing.has(i)) editing.delete(i); else editing.add(i); drawCard(); }},
          blockProp(a.block, ASK_Q_PROP) ? "Edit the question"
            : a.mention && ask === ASK_NOTE[askLang()].status ? "Add the question: this reads as a note to yourself"
            : "Add the question") : null,
        editing.has(i) ? editorFor(a, i) : null));
  };
  const head = text => el("div", {style: "color:var(--fg3);font-size:11.5px;text-transform:uppercase;letter-spacing:.05em;margin:12px 0 2px"}, text);
  const drawCard = () => {
    card.replaceChildren();
    for (const [q, label] of [[false, "Waiting for"], [true, "To ask about"]]) {
      const some = found.map((a, i) => [a, i]).filter(([a]) => !!a.mention === q);
      if (!some.length) continue;
      if (mixed) card.append(head(label));
      // What it is about, named once over the questions about it.
      let about = null;
      for (const [a, i] of some) {
        const h = headOf(a);
        if (h && h !== about)
          card.append(el("div", {style: "font-weight:600;font-size:13px;margin:12px 0 0"}, h));
        about = h || null;
        card.append(pickRowFor(a, i));
      }
    }
    refresh();
  };
  drawCard();

  /* One email by default: one thing to open, one thing to answer. Two when the
     questions deserve their own subject line, or should not wait on the rest. */
  const howBox = el("div", {class: "statefilter"});
  const drawHow = () => howBox.replaceChildren(...[[false, "One email with both"], [true, "Two emails: questions apart"]]
    .map(([v, label]) => el("button", {class: "chip filter" + (split === v ? " on" : ""),
      onclick: () => { split = v; drawHow(); refresh(); }}, (split === v ? "✓ " : "") + label)));
  drawHow();

  /* The lines go in the mail itself, each with a link to answer it. The
     attached sheet this once offered is gone (#363); the mail does its job. */
  const send = () => {
    const chosen = found.filter((_, i) => pick.has(i));
    if (!chosen.length) { notify("Pick at least one thing to ask about.", "warn"); return; }
    // The links in the mail reply to you, so they need your address.
    const replyTo = trim(email.value);
    if (!looksLikeEmail(replyTo)) {
      notify("Put in your email for " + (area || "this area") + ", so their answers have somewhere to go.", "warn");
      email.focus();
      return;
    }
    setEmailOf(me, area, replyTo);

    /* A durable id on each line, so their answer can find its way home even
       after the file has been re-read and every in-memory id regenerated. */
    const itemOf = a => inSpace(a.space, () => {
      const id = ensureBlockId(a.path, a.block);
      const d = a.age, i = found.indexOf(a);
      return {
        key: [a.space || "", a.path, id].join("\u0001"),
        title: a.title, q: !!a.mention, project: named.on ? aboutOf.get(a) : "",
        context: (contexts[i] || []).filter((_, j) => ctxPick[i].has(j)).map(({depth, text}) => ({depth, text})),
        ask: ownAsk(a),
        // How long it has been open, said in the mail's language.
        days: a.mention ? null : d != null && d > 0 ? d : null,
      };
    });
    // What owes you first, then the questions: two short lists, not one shuffled one.
    const owes = chosen.filter(a => !a.mention), qs = chosen.filter(a => a.mention);
    const waits = owes.map(itemOf), asks = qs.map(itemOf);
    const sends = split && waits.length && asks.length ? [[waits, owes, ""], [asks, qs, "_questions"]]
      : [[waits.concat(asks), owes.concat(qs), ""]];

    /* Asked is what you sent, not what you looked at: the lines are stamped,
       and your own questions wait on them, when the note goes. A note closed
       unsent leaves them as they were. What you reworded in the note can go
       back to the tasks, once you have said yes to it. */
    const sentOf = (items, lines) => (edited, then) => {
      for (const a of lines) inSpace(a.space, () => {
        setBlockProp(a.block, ASKED_PROP, me + " " + nowStamp());
        touch(a.path);
      });
      waitOnAsked(lines, name);
      render();
      offerAskWording(name, items, lines, edited, then);
    };
    const made = sends.map(([items, lines]) => ({items, sent: sentOf(items, lines), file: null, sheetOf: null}));
    closeModal();
    render();
    // Two emails are two notes, one after the other: the second opens when
    // you are done with the first.
    const noteAt = i => openAskNote(name, made[i].items, made[i].file, made[i].sheetOf, area,
      made[i + 1] ? {label: "Next: the questions", run: () => noteAt(i + 1)} : null, made[i].sent,
      () => openAskForUpdate(name, null, {picked: chosen.map(a => a.block)}));
    noteAt(0);
  };

  /* One main action, Write the message (#363). What only some asks need folds
     under More; your email stays out of it until it is known. Receiving a
     reply is not sending, so it sits apart, above the buttons. */
  const emailField = el("div", {class: "field"},
    el("label", {}, "Your email in " + (area || "this area") + ", where their answers come back to"),
    email,
    el("div", {style: "color:var(--fg3);font-size:12px;margin-top:6px"},
      saved ? "From email:: on your page in " + area + ". Change it there, or here."
            : "Saved on your page in " + (area || "this area") + " when you write the message, so you are asked once."));
  const more = el("details", {class: "field"},
    el("summary", {}, "More"),
    el("div", {style: "display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-top:8px"},
      el("button", {class: "btn sm ghost", onclick: () => toAi([...pick])}, "Let AI write the questions"),
      el("span", {style: "color:var(--fg3);font-size:12px"},
        "A question and a short summary for each ticked line.")),
    mixed ? el("div", {class: "field"}, el("label", {}, "Send as"), howBox) : null,
    found.some(a => aboutOf.get(a)) ? el("div", {class: "field"},
      el("div", {style: "display:flex;gap:10px;align-items:center"},
        toggle(() => named.on, () => { named.on = !named.on; PREF.set("askNameProjects", named.on ? "1" : "0"); }),
        el("span", {}, "Name the projects in what they get"))) : null,
    saved ? emailField : null);
  modal({
    center: true, title: "Ask " + name + " for an update",
    hint: found.length + " open",
    body: el("div", {},
      el("div", {class: "field"},
        el("label", {}, "What to ask about"),
        card, summary),
      saved ? null : emailField,
      more,
      el("div", {class: "field", style: "display:flex;gap:8px;align-items:center;flex-wrap:wrap;border-top:1px solid var(--line);padding-top:10px"},
        el("span", {style: "color:var(--fg2)"}, "Got an answer?"),
        el("button", {class: "btn sm ghost", onclick: () => { closeModal(); importUpdatePasted(); }}, "Paste a reply"),
        el("button", {class: "btn sm ghost", onclick: () => { closeModal(); importUpdateFromFile(); }}, "Import a file"))),
    foot: [
      el("button", {class: "btn ghost", onclick: closeModal}, "Cancel"),
      el("div", {style: "flex:1"}),
      el("button", {class: "btn primary", onclick: send}, "Write the message"),
    ],
  });
}
