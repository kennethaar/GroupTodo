function showTaskDetail(path, block, space) {
  state.selected = block.id;
  const a = {
    path, block, state: block.state, title: block.title,
    context: blockContext(block), due: dueDate(block),
    age: blockAge(block), added: addedDate(block),
  };
  /* The title is edited the way a Journal line is: names and @context read as
     words until it takes focus, then it is the text as written (P12, #317). */
  const titleInput = el("div", {class: "titlebox", contenteditable: "true", spellcheck: "true",
    role: "textbox", "aria-label": "Title", translate: "no", html: lineHtml(block)});
  // A click on a name edits the title here; following it would close the panel.
  keepClickCaret(titleInput, () => block.title);
  titleInput.addEventListener("focus", () => {
    if (titleInput.classList.contains("raw")) return;
    titleInput.classList.add("raw"); titleInput.textContent = block.title;
  });
  titleInput.addEventListener("keydown", e => {
    if (e.key === "Enter" && !e.isComposing && !(SUGGEST && SUGGEST.host === titleInput)) { e.preventDefault(); titleInput.blur(); }
  });
  // The verb check used to live in a standalone "GTD hygiene" row below the
  // fold. It is a fact about the title, so it sits on the title now: a quiet
  // nudge that is simply gone once the title starts with a physical verb.
  const verbNudge = el("button", {class: "achip want", style: "margin-top:4px",
    title: "GTD hygiene: start with a physical action verb, e.g. Call, Draft, Buy.",
    onclick: () => { closeModal(); openVerbPicker(path, block); }}, "! add a verb");
  const syncVerbNudge = () => { verbNudge.style.display = startsWithVerb(block.title) ? "none" : ""; };
  const notes = el("textarea", {placeholder: "Notes"}); notes.value = (block.body || []).join("\n");
  /* The same names, @ and [[ as the line itself. The chosen key takes one; Escape
     closes the list, not the panel. */
  for (const t of [titleInput, notes]) {
    attachSuggest(t);
    t.addEventListener("keydown", e => { if (suggestKey(e)) e.stopPropagation(); });
  }
  const sched = el("input", {type: "date", onchange: () => { saveSched(); renderSchedField(); }});
  const dead  = el("input", {type: "date", value: dateIn(blockProp(block, "DEADLINE")) || "", onchange: () => saveDead()});
  const timeOf = key => timeIn(String(blockProp(block, key) || "").replace(/\[\[[^\]]*\]\]/g, " ")) || "";
  const schedAt = clockInput("", {title: "Time, if it has one", onchange: () => { saveSched(); renderSchedField(); }});
  const deadAt  = clockInput(timeOf("DEADLINE"), {title: "Time, if it has one", onchange: () => saveDead()});
  const until = el("input", {type: "date", value: dateIn(blockProp(block, "until")) || "", onchange: () => saveUntil()});
  const priSel = el("select", {onchange: () => savePriority()});
  for (const [v, label] of [["", "None"], ["H", "High"], ["M", "Medium"], ["L", "Low"]])
    priSel.append(el("option", {value: v}, label));
  priSel.value = priorityOf(block) || "";
  // One date row, not three: what it is backed by -- SCHEDULED or hold:: -- follows
  // from the state already chosen above, so there is nothing extra to pick here.
  const schedLabel = el("label", {}, "Starts");
  const holdOpen = el("input", {type: "checkbox", onchange: () => { sched.disabled = holdOpen.checked; saveSched(); renderSchedField(); }});
  const holdOpenRow = el("label", {style: "display:flex;gap:6px;align-items:center;font-size:12px;margin-top:4px"},
    holdOpen, "No date: until I take it off");
  const loadSchedField = () => {
    const isHold = block.state === "HOLD";
    schedLabel.textContent = isHold ? "Hold until" : block.state === "WAIT" ? "Follow up" : "Starts";
    const val = isHold ? holdValue(blockProp(block, "hold")) : dateIn(blockProp(block, "SCHEDULED"));
    holdOpen.checked = isHold && val === HOLD_OPEN;
    sched.value = val && val !== HOLD_OPEN ? val : "";
    sched.disabled = holdOpen.checked;
    schedAt.value = isHold ? "" : timeOf("SCHEDULED");
    schedAt.style.display = isHold ? "none" : "";
    holdOpenRow.style.display = isHold ? "" : "none";
  };
  // Scheduled/Deadline/Priority/Assign start as a quiet "+" pill when unset, so
  // a task with none of these shows four short rows, not four empty fields.
  // Clicking the pill mounts the real control in its place, focused.
  let schedManualOpen = false, deadManualOpen = false, priManualOpen = false, assignManualOpen = false;
  const schedBox = el("div", {class: "field"});
  // Repeat and Reminder are facts about a date that is actually set -- a
  // reminder needs a time, a repeat needs a day to repeat from -- so both
  // live in the Scheduled section now and are simply absent otherwise,
  // instead of two always-visible rows asking about a date that may not
  // exist yet.
  const buildRepeatRow = () => {
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
      }}, choice ? choice[0].toUpperCase() + choice.slice(1) : "Never"));
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
    })}, own ? cur : "Custom…"));
    return row;
  };
  const renderSchedField = () => {
    schedBox.textContent = "";
    const isHold = block.state === "HOLD";
    const forcedOpen = isHold || block.state === "WAIT";
    const hasValue = isHold ? !!holdValue(blockProp(block, "hold")) : !!sched.value;
    if (!forcedOpen && !hasValue && !schedManualOpen) {
      schedBox.append(factPill("+ " + schedLabel.textContent, "fwant", "Give it a day",
        () => { schedManualOpen = true; renderSchedField(); sched.focus(); }));
      return;
    }
    schedBox.append(schedLabel, el("div", {class: "dt"}, sched, schedAt), holdOpenRow,
      el("button", {
        class: "btn ghost sm", style: "margin-top:4px",
        title: "Opens your calendar with the title and date. Nothing is sent anywhere.",
        onclick: () => {
          const when = trim(sched.value) || trim(dead.value) || dueDate(block);
          if (!when) { notify("Give it a date first.", "warn"); return; }
          const time = (trim(sched.value) ? schedAt.value : trim(dead.value) ? deadAt.value : null) || null;
          addToCalendar([Object.assign({}, a, {due: when, time, title: block.title, block})]);
        },
      }, "Add to calendar"));
    if (!isHold && trim(sched.value)) {
      schedBox.append(el("label", {style: "margin-top:4px", title: "Nothing is created until you tick it off; you'll be asked first."},
        "Repeats"), buildRepeatRow());
    }
    if (!isHold && trim(schedAt.value)) {
      schedBox.append(el("label", {style: "margin-top:4px"}, "Reminder"), remindSel);
    }
  };
  const deadBox = el("div", {class: "field"});
  const renderDeadField = () => {
    deadBox.textContent = "";
    if (!dead.value && !deadManualOpen) {
      deadBox.append(factPill("+ Due", "fwant", "The day it must be done by",
        () => { deadManualOpen = true; renderDeadField(); dead.focus(); }));
      return;
    }
    deadBox.append(el("label", {}, "Due"), el("div", {class: "dt"}, dead, deadAt),
      el("label", {style: "display:flex;align-items:center;gap:6px;font-size:12px;font-weight:400;" +
        "text-transform:none;letter-spacing:normal;margin-top:4px"}, "Auto-cancel after", until));
  };
  const priBox = el("div", {class: "field"});
  const renderPriField = () => {
    priBox.textContent = "";
    if (!priSel.value && !priManualOpen) {
      priBox.append(factPill("+ Priority", "fwant", "High, medium or low",
        () => { priManualOpen = true; renderPriField(); priSel.focus(); }));
      return;
    }
    priBox.append(el("label", {}, "Priority"), priSel);
  };
  const assignBox = el("div", {class: "field"});
  const renderAssignField = () => {
    assignBox.textContent = "";
    const current = assigneeOf(block);
    if (!current && !assignManualOpen) {
      assignBox.append(factPill("+ Assign", "fwant", "Give this to someone else in the area",
        () => { assignManualOpen = true; renderAssignField(); }));
      return;
    }
    const row = el("div", {class: "seg"});
    const choices = [["", "Me"]].concat(choreCrew().filter(m => !m.me).map(m => [m.name, m.name]));
    for (const [val, label] of choices) {
      const on = val ? samePerson(val, current) : !current;
      row.append(el("button", {class: on ? "on" : "", onclick: () => {
        closeModal(); assignBlock(path, block, val);
      }}, label));
    }
    row.append(el("button", {onclick: () => {
      closeModal(); openAssignOther(path, block);
    }}, current && !isMember(current) && !isHousehold(current) ? current : "someone else…"));
    assignBox.append(el("label", {
      title: "You get this in Waiting for; the household's stays yours to tick off.",
    }, "Who is doing it"), row);
  };
  const remindSel = el("select", {onchange: () => saveRemind()});
  const usualLabel = () => (remindUsual() ? leadWords(remindUsual()) + " before" : "At the time") + " (usual)";
  for (const [v, label] of [["", usualLabel()], ["0", "At the time"], ["5m", "5 min before"],
                            ["10m", "10 min before"], ["15m", "15 min before"], ["30m", "30 min before"],
                            ["1h", "1 hour before"], ["2h", "2 hours before"], ["1d", "A day before"],
                            ["none", "No reminder"]])
    remindSel.append(el("option", {value: v}, label));
  remindSel.value = trim(blockProp(block, "remind") || "");
  if (remindSel.value !== trim(blockProp(block, "remind") || ""))
    remindSel.append(el("option", {value: blockProp(block, "remind")}, blockProp(block, "remind") + " before"));
  remindSel.value = trim(blockProp(block, "remind") || "");

  // Picking a state leaves the panel open: moving TODO -> DOING -> WAIT used to
  // cost one trip through the panel per step, because the first pick closed it.
  // Cancelled and "not a task" are not in this bar -- they are one-way exits,
  // handled from the overflow menu, so the bar only ever shows where an open
  // task's work actually is.
  const PRIMARY_STATES = ["TODO", "DOING", "WAIT", "HOLD", "DONE"];
  const seg = el("div", {class: "seg"});
  const stateBtns = [];
  for (const st of PRIMARY_STATES) {
    const btn = el("button", {
      onclick: () => {
        if ((block.state ?? null) === st) return;
        setBlockState(path, block, st);
        syncPanel();                 // the panel outlives the redraw; its badges must keep up
      },
    }, STATE_WORD[st]);
    stateBtns.push([st, btn]);
    seg.append(btn);
  }
  const cancelledNote = el("span", {style: "color:var(--fg3);font-size:12.5px;margin-left:8px"}, "Cancelled");
  const reopenBtn = el("button", {class: "btn ghost sm", style: "margin-left:8px",
    onclick: () => { setBlockState(path, block, "TODO"); syncPanel(); }}, "Reopen");

  // The trail is the one part of the panel a state change rewrites, so it is
  // built as a function rather than once.
  const trail = el("div", {style: "color:var(--fg2);font-size:12.5px;line-height:1.8"});
  const fillTrail = () => {
    trail.textContent = "";
    const age = blockAge(block);
    trail.append((blockProp(block, "by") ? "Added by " + blockProp(block, "by") : "Added") +
      (addedDate(block) ? " on " + addedDate(block) : "") +
      (age != null ? " · " + age + " days ago" : ""));
    const raw = blockProp(block, "done_by");
    if (raw) {
      const {who, iso} = splitStamp(raw);
      trail.append(el("div", {}, "Closed by " + (who || "someone") + (iso ? " · " + formatStamp(iso) : "")));
    }
  };
  const syncPanel = () => {
    for (const [st, btn] of stateBtns) btn.className = (block.state ?? null) === st ? "on" : "";
    const cancelled = block.state === "CANCELLED";
    cancelledNote.style.display = cancelled ? "" : "none";
    reopenBtn.style.display = cancelled ? "" : "none";
    fillTrail();
    loadSchedField();
    renderSchedField();
    renderDeadField();
    renderPriField();
    renderAssignField();
    syncVerbNudge();
  };
  syncPanel();

  // The checklist of actual nested steps (block.children), not to be confused
  // with children:: below it -- a link to another page or task entirely. Both
  // are "subtasks" to someone reading the panel, so they share one section.
  const kidsList = el("div", {class: "subkids"});
  const renderKids = () => {
    kidsList.textContent = "";
    for (const kid of (block.children || []).filter(b => !isMessage(b))) {
      const done = !OPEN_STATES[kid.state];
      const cb = el("input", {type: "checkbox", checked: done, onchange: () => {
        setBlockState(path, kid, cb.checked ? "DONE" : "TODO");
        touch(path); noteTodoTouched(); render(); renderKids();
      }});
      kidsList.append(el("div", {class: "subkid" + (done ? " done" : "")}, cb,
        el("button", {class: "subkidtitle", onclick: () => { closeModal(); openTaskDetail(path, kid, space); }},
          linkWords(kid.title) || "(untitled)")));
    }
  };
  renderKids();

  const drop = key => { for (const k of Object.keys(block.props)) if (k.toLowerCase() === key) delete block.props[k]; };
  // Every field saves itself the moment it changes -- on blur for text, on
  // change for selects/dates/pills -- so there is nothing left to lose by
  // closing the panel and nothing a footer button needs to batch up.
  const saveTitle = () => {
    const val = trim(lineText(titleInput)).replace(/\n/g, " ");
    titleInput.classList.remove("raw");
    if (val === block.title) { titleInput.innerHTML = lineHtml(block); return; }
    const [st, rest] = splitState(val);
    if (st) { block.state = st; block.title = rest; } else { block.title = val; }
    if (block.state) block.title = dotsToEst(block.title);
    createLinkedPages(block.title);
    touch(path); noteTodoTouched(); render(); syncPanel();
    titleInput.innerHTML = lineHtml(block);
  };
  const saveNotes = () => {
    block.body = notes.value.split("\n");
    while (block.body.length && !trim(block.body[block.body.length - 1])) block.body.pop();
    touch(path); noteTodoTouched();
  };
  const saveSched = () => {
    if (block.state === "HOLD") {
      const prevHold = holdValue(blockProp(block, "hold"));
      if (holdOpen.checked) setBlockProp(block, "hold", HOLD_OPEN);
      else if (sched.value) setBlockProp(block, "hold", "[[" + sched.value + "]]");
      else if (prevHold) endHold(block.props, prevHold > todayISO() && hasRepeatUnder([block]));
      touch(path); noteTodoTouched(); render();
      return;
    }
    if (badClock(schedAt)) return;
    const dueWas = dueDate(block);
    if (sched.value) setBlockProp(block, "SCHEDULED", whenValue(sched.value, schedAt.value));
    else drop("scheduled");
    touch(path); noteTodoTouched(); render();
    if (dueDate(block) !== dueWas) warnDueConflict(path, block);
  };
  const saveDead = () => {
    if (badClock(deadAt)) return;
    const dueWas = dueDate(block);
    if (dead.value) setBlockProp(block, "DEADLINE", whenValue(dead.value, deadAt.value));
    else drop("deadline");
    touch(path); noteTodoTouched(); render();
    if (dueDate(block) !== dueWas) warnDueConflict(path, block);
  };
  const saveUntil = () => {
    if (until.value) setBlockProp(block, "until", "[[" + until.value + "]]");
    else drop("until");
    touch(path); noteTodoTouched(); render();
  };
  const saveRemind = () => {
    if (remindSel.value) setBlockProp(block, "remind", remindSel.value);
    else drop("remind");
    touch(path); noteTodoTouched();
  };
  const savePriority = () => {
    if (priSel.value) setBlockProp(block, "priority", priSel.value);
    else drop("priority");
    touch(path); noteTodoTouched(); render();
  };
  titleInput.addEventListener("blur", saveTitle);
  notes.addEventListener("blur", saveNotes);

  // The header's overflow menu: a small anchored list, built and torn down on
  // demand like the @ and [[ suggest list, not a nested dialog -- opening one
  // of those would close this very panel, since that is what a new dialog does.
  let menuBox = null;
  const onDocDown = e => { if (menuBox && !menuBox.contains(e.target) && e.target !== menuBtn) closeMenu(); };
  const onDocKey = e => { if (e.key === "Escape") { closeMenu(); e.stopPropagation(); } };
  const closeMenu = () => {
    if (!menuBox) return;
    menuBox.remove(); menuBox = null;
    document.removeEventListener("mousedown", onDocDown, true);
    document.removeEventListener("keydown", onDocKey, true);
  };
  const menuBtn = el("button", {class: "iconbtn", title: "More", onclick: () => {
    if (menuBox) { closeMenu(); return; }
    menuBox = el("div", {class: "linkpop", role: "menu"},
      el("button", {class: "pick", onclick: () => { closeMenu(); setBlockState(path, block, "CANCELLED"); syncPanel(); }}, "Cancel task"),
      el("button", {class: "pick", onclick: () => { closeMenu(); setBlockState(path, block, null); syncPanel(); }}, "Convert to note"),
      el("button", {class: "pick", onclick: () => {
        closeMenu(); closeModal();
        openItemSpacePicker({path, space, id: block.id});
      }}, "Move to another area"),
      el("button", {class: "pick", style: "color:var(--bad,#c0392b)", onclick: () => {
        closeMenu(); closeModal();
        deleteBlockWithUndo(path, block, "Deleted “" + titleForRow(block.title) + "”");
      }}, "Delete task"));
    document.body.append(menuBox);
    const r = menuBtn.getBoundingClientRect();
    menuBox.style.left = Math.max(8, Math.min(r.left, window.innerWidth - 230)) + "px";
    menuBox.style.top = (r.bottom + 4) + "px";
    document.addEventListener("mousedown", onDocDown, true);
    document.addEventListener("keydown", onDocKey, true);
  }}, "⋯");
  const srcBtn = el("button", {class: "btn ghost sm", title: "Open where it is written", onclick: () => { closeModal(); openPage(path); }}, placeName(path));
  const copyBtn = el("button", {class: "iconbtn", title: "A link you can paste into chat or email",
    onclick: () => copyLinkTo(deepLink(path, block), "this task")}, "\u{1F517}");

  const result = modal({
    title: "", hint: "", side: true,
    body: el("div", {class: "tdbody"},
      el("div", {class: "field"}, titleInput, verbNudge),
      el("div", {class: "field"},
        el("div", {style: "display:flex;align-items:center;flex-wrap:wrap"}, seg, cancelledNote, reopenBtn)),
      el("div", {class: "field"}, surroundingsGrid(path, block, space)),
      el("div", {class: "field"},
        el("label", {}, svgIcon(ICON_CHECKLIST), " Subtasks"),
        kidsList,
        factLine(path, childrenFact({path, block, space}))),
      el("div", {class: "field pillrow"}, schedBox, deadBox, assignBox, priBox),
      el("div", {class: "field"},
        el("label", {
          title: "Everyone in this area sees it. Flag one with ⚑ to follow it across devices.",
        }, svgIcon(ICON_CHAT), " Chat" + (messagesOf(block).length ? " · " + messagesOf(block).length : "")),
        threadPanel(path, block),
        el("div", {style: "margin-top:8px;display:flex;gap:8px;align-items:center;flex-wrap:wrap"},
          el("button", {class: "btn sm ghost", onclick: () => { closeModal(); informFromLine(path, block, space); }}, svgIcon(ICON_MAIL), " Send an update"),
          // Asking needs someone named on the line; one goes straight there, several are picked from.
          ...(() => {
            const ps = inSpace(space, () => linePeople(block));
            if (!ps.length) return [];
            return [el("button", {class: "btn sm ghost", onclick: () => {
              closeModal();
              if (ps.length === 1) openAskForUpdate(ps[0], block);
              else chipMenu("Ask who for an update?", null, lettered(ps.map(n => [n, null, () => openAskForUpdate(n, block)])));
            }}, svgIcon(ICON_MAIL), " Ask for an update"),
              // Their answer comes back here too, not only on Waiting for (#370).
              el("button", {class: "btn sm ghost", onclick: () => { closeModal(); importUpdatePasted(); }}, "Paste a reply")];
          })(),
          el("span", {style: "color:var(--fg3);font-size:12px"},
            informedAt(block) ? "Last told " + trim(blockProp(block, INFORMED_PROP)).replace(/\s+\S+$/, "") + " on " + informedAt(block) + "."
                              : "Tell whoever it names where it stands. Alt+U on the line."))),
      el("div", {class: "field"}, el("label", {}, "Notes"), notes),
      el("div", {class: "field"}, trail)),
    onKey: e => {
      /* Escape hands the panel over to the grid rather than closing it. Once
         the grid has it, the grid's own Escape hands it back, and the one after
         that closes the panel as it always did, so nothing is taken away. */
      if (e.key === "Escape" && !e.aroundLeft) {
        const grid = $("#modalRoot") && $("#modalRoot").querySelector(".around");
        if (grid && !grid.classList.contains("picking")) return aroundSelect(grid);
      }
      return false;
    },
    onClose: () => closeMenu(),
  });

  // One header, not two: the source path takes the title's place and the
  // close button gains the copy-link and overflow-menu buttons beside it,
  // instead of a second row repeating them under a bare icon bar (#308).
  const header = result.root.querySelector("header");
  header.replaceChild(srcBtn, header.querySelector("h2"));
  header.insertBefore(copyBtn, header.lastElementChild);
  header.insertBefore(menuBtn, header.lastElementChild);

}
