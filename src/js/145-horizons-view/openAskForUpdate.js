/* only: a line to start with ticked by itself -- the line a name was rested
   on, or the line menu's -- with the rest of theirs there to add. */
function openAskForUpdate(name, only = null) {
  const me = whoAmI();
  if (!me) { notify("Put your name in first - the sheet has to say who is asking.", "warn"); return; }
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
  const partsOf = new Map(found.map(a => [a, a.mention
    ? askQuestionParts({title: a.title, project: aboutOf.get(a), context: contextLinesOf(a.block)}, name)
    : {subject: "", ask: checkinTaskTitle(a.title, name)}]));
  const firstOf = new Map();
  found.forEach((a, i) => { const k = partsOf.get(a).subject; if (k && !firstOf.has(k)) firstOf.set(k, i); });
  const rank = new Map(found.map((a, i) => [a, partsOf.get(a).subject ? firstOf.get(partsOf.get(a).subject) : i]));
  found.sort((x, y) => rank.get(x) - rank.get(y));

  const at = only ? found.findIndex(a => a.block === only) : -1;
  const pick = new Set(at >= 0 ? [at] : found.map((_, i) => i));
  const area = found[0].space || Spaces.active || "";
  const saved = emailOf(me, area);
  const email = el("input", {type: "email", placeholder: "you@example.com",
    value: saved});
  const card = el("div", {style: "max-height:40vh;overflow:auto"});
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
      : "Nothing selected - the sheet would be empty.";
  };

  /* The lines under each task go along by default, since they are usually what
     makes the question answerable. Each has its own tick, because a note to
     yourself is not always a note for them. */
  const contexts = found.map(a => contextLinesOf(a.block));
  const ctxPick = contexts.map(lines => new Set(lines.map((_, j) => j)));
  const toggle = (on, flip, size = 22) => {
    const box = el("button", {class: "spacetoggle" + (on() ? " on" : ""),
      style: size < 22 ? "width:" + size + "px;height:" + size + "px;font-size:11px;flex:0 0 auto" : "",
      onclick: () => { flip(); box.className = "spacetoggle" + (on() ? " on" : ""); box.textContent = on() ? "✓" : ""; refresh(); }},
      on() ? "✓" : "");
    return box;
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
          [ask && subject ? null : a.project || baseName(a.path),
           a.age != null ? "open " + a.age + "d" : null,
           d != null ? "asked " + d + "d ago" : "never asked",
           lines.length ? "the lines under it go along unless you untick them" : null,
          ].filter(Boolean).join(" · ")),
        ...lines));
  };
  const head = text => el("div", {style: "color:var(--fg3);font-size:11.5px;text-transform:uppercase;letter-spacing:.05em;margin:12px 0 2px"}, text);
  for (const [q, label] of [[false, "Waiting for"], [true, "To ask about"]]) {
    const some = found.map((a, i) => [a, i]).filter(([a]) => !!a.mention === q);
    if (!some.length) continue;
    if (mixed) card.append(head(label));
    // What it is about, named once over the questions about it.
    let about = null;
    for (const [a, i] of some) {
      const {subject, ask} = partsOf.get(a);
      if (subject && ask && subject !== about)
        card.append(el("div", {style: "font-weight:600;font-size:13px;margin:12px 0 0"}, subject));
      about = subject && ask ? subject : null;
      card.append(pickRowFor(a, i));
    }
  }
  refresh();

  /* One email by default: one thing to open, one thing to answer. Two when the
     questions deserve their own subject line, or should not wait on the rest. */
  const howBox = el("div", {class: "statefilter"});
  const drawHow = () => howBox.replaceChildren(...[[false, "One email with both"], [true, "Two emails: questions apart"]]
    .map(([v, label]) => el("button", {class: "chip filter" + (split === v ? " on" : ""),
      onclick: () => { split = v; drawHow(); refresh(); }}, (split === v ? "✓ " : "") + label)));
  drawHow();

  /* sheet: the HTML file to fill in and send back, attached by hand, which is
     easier to answer than a long mail or a Teams message. Without it the same
     lines go in the mail itself, to answer with a plain reply. */
  const send = sheet => {
    const chosen = found.filter((_, i) => pick.has(i));
    if (!chosen.length) { notify("Pick at least one thing to ask about.", "warn"); return; }
    // The sheet and the links in the mail both reply to you, so both need your address.
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
        context: (contexts[i] || []).filter((_, j) => ctxPick[i].has(j)),
        // How long it has been open, said on the sheet in the sheet's language.
        days: a.mention ? null : d != null && d > 0 ? d : null,
      };
    });
    /* What owes you first, then the questions, so a sheet with both reads
       as two short lists rather than one shuffled one. */
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
    /* The file is made when the note goes, from the note as you left it, so
       a question you reworded reads the same in both. The date tells this
       ask from older ones in Downloads. */
    const made = sends.map(([items, lines, tail]) => sheet
      ? {items, sent: sentOf(items, lines),
         file: slugPerson(name).toLowerCase().replace(/[^\w-]+/g, "-") + tail + "_" + fileWhen() + ".html",
         sheetOf: edited => checkinSheetHtml({to: name, from: me, items: edited, replyTo})}
      : {items, sent: sentOf(items, lines), file: null, sheetOf: null});
    closeModal();
    render();
    // Two emails are two notes, one after the other: the second opens when
    // you are done with the first.
    const noteAt = i => openAskNote(name, made[i].items, made[i].file, made[i].sheetOf, area,
      made[i + 1] ? {label: "Next: the questions", run: () => noteAt(i + 1)} : null, made[i].sent);
    noteAt(0);
  };

  modal({
    center: true, title: "Ask " + name + " for an update",
    hint: found.length + " open",
    body: el("div", {},
      el("div", {class: "field"},
        el("label", {}, "What to ask about"),
        card, summary),
      mixed ? el("div", {class: "field"}, el("label", {}, "Send as"), howBox) : null,
      found.some(a => aboutOf.get(a)) ? el("div", {class: "field"},
        el("div", {style: "display:flex;gap:10px;align-items:center"},
          toggle(() => named.on, () => { named.on = !named.on; PREF.set("askNameProjects", named.on ? "1" : "0"); }),
          el("span", {}, "Name the projects in what they get"))) : null,
      el("div", {class: "field"},
        el("label", {}, "Your email in " + (area || "this area") + ", where their answers come back to"),
        email,
        el("div", {style: "color:var(--fg3);font-size:12px;margin-top:6px"},
          saved ? "From email:: on your page in " + area + ". Change it there, or here."
                : "Not on your page in " + (area || "this area") + " yet. It is saved there as " +
                  "email:: when you write the email or make the sheet, so you are only asked once.")),
      el("div", {class: "field"},
        el("div", {style: "color:var(--fg3);font-size:12.5px"},
          "Write the email: each line numbered in the mail itself, with a link on each that opens a short " +
          "reply to you, so " + name + " answers with a click or a plain reply you paste back. Nothing to " +
          "open and no account. Make the sheet: the same as one HTML file to attach as well, for a long list."))),
    foot: [
      el("button", {class: "btn ghost", onclick: closeModal}, "Cancel"),
      el("button", {class: "btn ghost", onclick: () => { closeModal(); importUpdatePasted(); }},
        "Paste a reply"),
      el("button", {class: "btn ghost", onclick: () => { closeModal(); importUpdateFromFile(); }},
        "Import a file"),
      el("button", {class: "btn ghost", onclick: () => send(true)}, "Make the sheet"),
      el("button", {class: "btn primary", onclick: () => send(false)}, "Write the email"),
    ],
  });
}
