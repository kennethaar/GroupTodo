function showTaskDetail(path, block, space) {
  state.selected = block.id;
  const a = {
    path, block, state: block.state, title: block.title,
    context: blockContext(block), due: dueDate(block),
    age: blockAge(block), added: addedDate(block),
  };
  const titleInput = el("textarea", {}); titleInput.value = block.title;
  const notes = el("textarea", {placeholder: "Notes"}); notes.value = (block.body || []).join("\n");
  /* The same names, @ and [[ as the line itself. Tab takes one; Escape
     closes the list, not the panel. */
  for (const t of [titleInput, notes]) {
    attachSuggest(t);
    t.addEventListener("keydown", e => { if (suggestKey(e)) e.stopPropagation(); });
  }
  const sched =el("input", {type: "date", value: dateIn(blockProp(block, "SCHEDULED")) || ""});
  const dead  = el("input", {type: "date", value: dateIn(blockProp(block, "DEADLINE")) || ""});
  const timeOf = key => timeIn(String(blockProp(block, key) || "").replace(/\[\[[^\]]*\]\]/g, " ")) || "";
  const schedAt = clockInput(timeOf("SCHEDULED"), {title: "Time, if it has one"});
  const deadAt  = clockInput(timeOf("DEADLINE"), {title: "Time, if it has one"});
  const until = el("input", {type: "date", value: dateIn(blockProp(block, "until")) || ""});
  const priSel = el("select", {});
  for (const [v, label] of [["", "None"], ["H", "High"], ["M", "Medium"], ["L", "Low"]])
    priSel.append(el("option", {value: v}, label));
  priSel.value = priorityOf(block) || "";
  const holdWas = holdValue(blockProp(block, "hold"));
  const hold = el("input", {type: "date", value: holdWas && holdWas !== HOLD_OPEN ? holdWas : ""});
  const holdOpen = el("input", {type: "checkbox", checked: holdWas === HOLD_OPEN,
    onchange: () => { hold.disabled = holdOpen.checked; }});
  hold.disabled = holdOpen.checked;
  const remindSel = el("select", {});
  const usualLabel = () => (remindUsual() ? leadWords(remindUsual()) + " before" : "At the time") + " (usual)";
  for (const [v, label] of [["", usualLabel()], ["0", "At the time"], ["5m", "5 min before"],
                            ["10m", "10 min before"], ["15m", "15 min before"], ["30m", "30 min before"],
                            ["1h", "1 hour before"], ["2h", "2 hours before"], ["1d", "A day before"],
                            ["none", "No reminder"]])
    remindSel.append(el("option", {value: v}, label));
  /* The one picked here, made the usual for every timed task without its own.
     This device only, like the meeting reminders: it is about where you are. */
  const remindUsualBtn = el("button", {class: "textbtn", style: "margin-top:4px", onclick: () => {
    const lead = remindLead(remindSel.value);
    if (!remindSel.value || lead == null) { notify("Pick a time before the task first, then make it the usual.", "warn"); return; }
    PREF.set(REMIND_LEAD_KEY, String(lead));
    remindSel.value = "";
    remindSel.options[0].textContent = usualLabel();
    notify("Timed tasks now remind you " + (lead ? leadWords(lead) + " before" : "at the time") + ", on this device.");
  }}, "Make it my usual");
  remindSel.value = trim(blockProp(block, "remind") || "");
  if (remindSel.value !== trim(blockProp(block, "remind") || ""))
    remindSel.append(el("option", {value: blockProp(block, "remind")}, blockProp(block, "remind") + " before"));
  remindSel.value = trim(blockProp(block, "remind") || "");

  // Picking a state leaves the panel open: moving TODO -> DOING -> WAIT used to
  // cost one trip through the panel per step, because the first pick closed it.
  // The last entry is the way back out: stop being a task, keep the words.
  const seg = el("div", {class: "seg"});
  const stateBtns = [];
  for (const st of [...TODO_STATES, null]) {
    const btn = el("button", {
      title: st ? null : "Keep the text as a plain note",
      onclick: () => {
        if ((block.state ?? null) === st) return;
        setBlockState(path, block, st);
        syncPanel();                 // the panel outlives the redraw; its badges must keep up
      },
    }, st || "Not a task");
    stateBtns.push([st, btn]);
    seg.append(btn);
  }

  // The trail is the one part of the panel a state change rewrites, so it is
  // built as a function rather than once.
  const trail = el("div", {style: "color:var(--fg2);font-size:12.5px;line-height:1.8"});
  const fillTrail = () => {
    trail.textContent = "";
    const age = blockAge(block);
    trail.append((blockProp(block, "by") ? "Added by " + blockProp(block, "by") : "Added") +
      (addedDate(block) ? " on " + addedDate(block) : "") +
      (age != null ? " \u00B7 " + age + " days ago" : ""));
    const raw = blockProp(block, "done_by");
    if (raw) {
      const {who, iso} = splitStamp(raw);
      trail.append(el("div", {}, "Closed by " + (who || "someone") + (iso ? " \u00B7 " + formatStamp(iso) : "")));
    }
  };
  const syncPanel = () => {
    for (const [st, btn] of stateBtns) btn.className = (block.state ?? null) === st ? "on" : "";
    fillTrail();
  };
  syncPanel();

  const save = () => {
    if (badClock(schedAt, deadAt)) return;
    const val = trim(titleInput.value).replace(/\n/g, " ");
    const [st, rest] = splitState(val);
    if (st) { block.state = st; block.title = rest; } else { block.title = val; }
    if (block.state) block.title = dotsToEst(block.title);
    createLinkedPages(block.title);
    block.body = notes.value.split("\n");
    while (block.body.length && !trim(block.body[block.body.length - 1])) block.body.pop();
    const drop = key => { for (const k of Object.keys(block.props)) if (k.toLowerCase() === key) delete block.props[k]; };
    if (sched.value) setBlockProp(block, "SCHEDULED", whenValue(sched.value, schedAt.value));
    else drop("scheduled");
    if (dead.value) setBlockProp(block, "DEADLINE", whenValue(dead.value, deadAt.value));
    else drop("deadline");
    if (until.value) setBlockProp(block, "until", "[[" + until.value + "]]");
    else drop("until");
    if (remindSel.value) setBlockProp(block, "remind", remindSel.value);
    else drop("remind");
    if (priSel.value) setBlockProp(block, "priority", priSel.value);
    else drop("priority");
    if (holdOpen.checked) setBlockProp(block, "hold", HOLD_OPEN);
    else if (hold.value) setBlockProp(block, "hold", "[[" + hold.value + "]]");
    else if (holdWas) endHold(block.props, holdWas > todayISO() && hasRepeatUnder([block]));
    touch(path); noteTodoTouched(); closeModal(); render();
  };

  modal({
    title: "", hint: "", side: true,
    body: el("div", {},
      el("div", {class: "field"}, el("label", {}, "Title"), titleInput),
      el("div", {class: "field"}, el("label", {}, "State"), seg),
      el("div", {class: "field"}, el("label", {}, "Where it sits"), surroundingsGrid(path, block, space)),
      el("div", {class: "field"}, factLine(path, childrenFact({path, block, space}))),
      el("div", {class: "field"},
        el("label", {}, "Who is doing it"),
        (() => {
          const row = el("div", {class: "seg"});
          const current = assigneeOf(block);
          const choices = [["", "Me"]].concat(
            members().filter(m => !m.me).map(m => [m.name, m.name]));
          for (const [val, label] of choices) {
            const on = val ? samePerson(val, current) : !current;
            row.append(el("button", {class: on ? "on" : "", onclick: () => {
              closeModal(); assignBlock(path, block, val);
            }}, label));
          }
          row.append(el("button", {onclick: () => {
            closeModal(); openAssignOther(path, block);
          }}, current && !isMember(current) ? current : "someone else\u2026"));
          return row;
        })(),
        el("div", {style: "color:var(--fg3);font-size:12px;margin-top:6px"},
          "Somebody in this area gets it as their task, and you get it in your " +
          "Waiting for. Anybody else is only a waiting-for - they cannot see this.")),
      el("div", {class: "field"},
        el("label", {}, "Chat" + (messagesOf(block).length ? " \u00B7 " + messagesOf(block).length : "")),
        threadPanel(path, block),
        el("div", {style: "color:var(--fg3);font-size:12px;margin-top:6px"},
          "Everyone in this area sees it, with who said it and when. Flag one with " +
          "\u2691 to come back to it - that carries your name, so it follows you between " +
          "devices. Read is per device and stays out of the files."),
        el("div", {style: "margin-top:8px;display:flex;gap:8px;align-items:center;flex-wrap:wrap"},
          el("button", {class: "btn sm ghost", onclick: () => { closeModal(); informFromLine(path, block, space); }}, "✉ Send an update"),
          el("span", {style: "color:var(--fg3);font-size:12px"},
            informedAt(block) ? "Last told " + trim(blockProp(block, INFORMED_PROP)).replace(/\s+\S+$/, "") + " on " + informedAt(block) + "."
                              : "Tell whoever it names where it stands. Alt+U on the line."))),
      el("div", {class: "field"}, el("label", {}, "GTD hygiene"), el("div", {class: "seg"},
        el("button", {onclick: () => { closeModal(); promptAndInsertContext(path, block); }},
          a.context ? "@" + a.context : "add context"),
        el("button", {onclick: () => { closeModal(); openVerbPicker(path, block); }},
          startsWithVerb(block.title) ? "verb ok" : "add physical verb"),
        el("button", {onclick: () => { closeModal(); openRefile(path, block); }}, "refile"),
      )),
      el("div", {class: "grid2"},
        el("div", {class: "field"}, el("label", {}, "Scheduled"), el("div", {class: "dt"}, sched, schedAt)),
        el("div", {class: "field"}, el("label", {}, "Deadline"), el("div", {class: "dt"}, dead, deadAt))),
      el("div", {class: "grid2"},
        el("div", {class: "field"}, el("label", {}, "Reminder, when it has a time"), remindSel, remindUsualBtn),
        el("div", {class: "field"}, el("label", {}, "Cancel it if still open after"), until)),
      el("div", {class: "grid2"},
        el("div", {class: "field"}, el("label", {}, "Priority"), priSel),
        el("div", {class: "field"}, el("label", {}, "On hold until"), hold,
          el("label", {style: "display:flex;gap:6px;align-items:center;font-size:12px;margin-top:4px"},
            holdOpen, "No date: until I take it off"))),
      el("div", {class: "grid2"},
        el("div", {class: "field"}, el("label", {}, "Urgency"),
          (() => {
            const who = assigneeOf(block);
            const row = {block, state: block.state, title: block.title, context: contextOf(block.title),
                         project: (nearestProjectAncestor(block) || {}).title || (statusDirOf(path) ? pageTitle(path) : null),
                         projectPath: statusDirOf(path) ? path : null, space,
                         mine: !who || samePerson(who, whoAmI())};
            const parts = urgencyParts(row);
            return el("div", {style: "font-size:12.5px;color:var(--fg2);line-height:1.6"},
              el("div", {style: "font-weight:600;color:var(--fg)"}, "↑" + urgencyOf(row)),
              ...parts.map(([why, n]) => el("div", {}, (n > 0 ? "+" : "") + n + "  " + why)));
          })())),
      el("div", {class: "field"},
        el("label", {}, "Repeats"),
        (() => {
          const row = el("div", {class: "seg"});
          const cur = repeatOf(block);
          for (const choice of REPEAT_CHOICES) {
            const on = trim(cur).toLowerCase() === choice;
            row.append(el("button", {class: on ? "on" : "", onclick: () => {
              if (choice) setBlockProp(block, REPEAT_PROP, choice);
              else for (const k of Object.keys(block.props)) if (k.toLowerCase() === REPEAT_PROP) delete block.props[k];
              touch(path);
              closeModal(); render();
              notify(choice ? "Repeats " + choice + ". You will be asked when you tick it off."
                            : "No longer repeats.");
            }}, choice || "never"));
          }
          // Anything the row does not have -- weekly on mon, thu; the last friday of the month.
          const own = trim(cur) && !REPEAT_CHOICES.includes(trim(cur).toLowerCase());
          row.append(el("button", {class: own ? "on" : "", onclick: () => openRecurrenceDialog({
            title: "Repeats", spec: cur,
            onSave: ({spec}) => {
              if (spec) setBlockProp(block, REPEAT_PROP, spec);
              else for (const k of Object.keys(block.props)) if (k.toLowerCase() === REPEAT_PROP) delete block.props[k];
              touch(path); render();
              notify(spec ? "Repeats " + spec + ". You will be asked when you tick it off." : "No longer repeats.");
            },
          })}, own ? cur : "custom\u2026"));
          return row;
        })(),
        el("div", {style: "color:var(--fg3);font-size:12px;margin-top:6px"},
          repeatOf(block)
            ? "Nothing is created until you tick this one off, and you are asked first. " +
              "Skip a " + repeatOf(block).replace(/ly$/, "") + " and it stays skipped."
            : "Any of these, or write your own in the file - repeat:: every 2 weeks, " +
              "repeat:: every monday.")),
      el("div", {class: "field"},
        el("label", {}, "Calendar"),
        el("div", {style: "display:flex;gap:8px;flex-wrap:wrap"},
          el("button", {class: "btn ghost sm", onclick: () => {
            const when = trim(sched.value) || trim(dead.value) || dueDate(block);
            if (!when) { notify("Give it a date first.", "warn"); return; }
            const time = (trim(sched.value) ? schedAt.value : trim(dead.value) ? deadAt.value : null) || null;
            addToCalendar([Object.assign({}, a, {due: when, time, title: block.title, block})]);
          }}, "Add to calendar"),
          el("button", {class: "btn ghost sm", onclick: () => {
            const when = trim(sched.value) || trim(dead.value) || dueDate(block);
            if (!when) { notify("Give it a date first.", "warn"); return; }
            const time = (trim(sched.value) ? schedAt.value : trim(dead.value) ? deadAt.value : null) || null;
            openCalendarPicker([Object.assign({}, a, {due: when, time, title: block.title, block})]);
          }}, "Choose where")),
        el("div", {style: "color:var(--fg3);font-size:12px;margin-top:6px"},
          "The file route sends nothing anywhere. A link opens your calendar with the " +
          "title and date in the web address.")),
      el("div", {class: "field"}, el("label", {}, "Notes"), notes),
      el("div", {class: "field"}, el("label", {}, "Trail"), trail),
      el("div", {class: "field"}, el("label", {}, "Source"),
        el("div", {style: "display:flex;gap:8px;flex-wrap:wrap;align-items:center"},
          el("button", {class: "btn ghost sm", onclick: () => { closeModal(); openPage(path); }}, path),
          el("button", {class: "btn ghost sm", title: "A link you can paste into chat or email",
            onclick: () => copyLinkTo(deepLink(path, block), "this task")}, "\u{1F517} Copy link")))),
    foot: [
      el("button", {class: "btn ghost", onclick: () => {
        closeModal();
        deleteBlockWithUndo(path, block, "Deleted \u201C" + titleForRow(block.title) + "\u201D");
      }}, "Delete"),
      el("div", {style: "flex:1"}),
      el("button", {class: "btn ghost", onclick: closeModal}, "Cancel"),
      el("button", {class: "btn primary", onclick: save}, "Save"),
    ],
    onKey: e => {
      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) { save(); return true; }
      /* Escape hands the panel over to the grid rather than closing it. Once
         the grid has it, the grid's own Escape hands it back, and the one after
         that closes the panel as it always did, so nothing is taken away. */
      if (e.key === "Escape" && !e.aroundLeft) {
        const grid = $("#modalRoot") && $("#modalRoot").querySelector(".around");
        if (grid && !grid.classList.contains("picking")) return aroundSelect(grid);
      }
      return false;
    },
  });
}
