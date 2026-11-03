function outlineBlock(path, page, b, opts = {}) {
  const kids = b.children || [];
  const ro = !!opts.readonly;
  const node = el("div", {class: "blk" + (kids.length ? " has-kids" : "") + (b.collapsed ? " collapsed" : ""), data: {id: b.id, space: V.space, path}});
  const line = el("div", {class: "line"});
  paintHeadLine(line, b.title, b.state);

  const foldLabel = kids.length ? (b.collapsed ? "Unfold branch" : "Fold branch") : "No lines under this one";
  line.append(el("button", {
    class: "branch-toggle" + (kids.length ? "" : " branch-leaf"),
    title: foldLabel, "aria-label": foldLabel,
    "aria-expanded": String(!b.collapsed), disabled: !kids.length,
    onclick: e => { e.stopPropagation(); if (kids.length) { b.collapsed = !b.collapsed; render(); } },
  }, kids.length ? (b.collapsed ? "\u25B8" : "\u25BE") : ""));
  line.append(el("button", {
    class: "bullet", title: "Focus on this line", "aria-label": "Focus on this line",
    onclick: e => { e.stopPropagation(); setBranchFocus(page, b.id, path); },
  }));
  /* The state's square, doing what a task row's tick does: a tap and a hold. The
     menu here also has the way back to a plain note. */
  if (b.state) {
    const stateBtn = el("button", {
      class: "tick", data: {state: b.state}, disabled: ro,
      title: b.state === "DONE" ? "Not done after all (hold for every state)" : "Done (hold for every state)",
    }, ...tickParts(b.state, b));
    line.append(ro ? stateBtn : holdable(stateBtn, () => {
      keepFocus(idSel(".blk", b.id, ".tick"), stateBtn);
      tapTaskState(path, b);
    }, () => lineStateMenu(path, b, node.dataset.space, true)));
  }

  const lead = meetLead(b);
  if (lead) line.append(lead);
  const txt = el("div", {
    class: "txt", contenteditable: ro ? "false" : "true", spellcheck: "false",
    html: lineHtml(b, opts.leadCtx),
  });
  if (ro) {
    line.append(txt);
    node.append(line);
    (b.body || []).forEach(l => node.append(el("div", {class: "bodyline", translate: "no", html: renderInline(l)})));
    const shown = liveMacros(path, b);
    if (shown) node.append(shown);
    if (!b.collapsed) for (const k of kids) node.append(outlineBlock(path, page, k, opts));
    return node;
  }
  attachOutlineUndo(txt,path,b);
  // Clicking a [[link]] must follow it, not drop into the editor. Focus would
  // replace this line with its raw text and destroy the span mid-click, so
  // refuse focus for that one gesture and let the delegated handler navigate.
  txt.addEventListener("mousedown", e => {
    if (e.target.closest("[data-link], [data-bref], a[href]")) e.preventDefault();
  });
  keepClickCaret(txt, () => b.title);
  txt.addEventListener("focus", () => { line.classList.add("raw"); txt.textContent = b.title; flyShow(txt, path, page, b); });
  // In a chapter, quotes and dashes are set in the book's style as they are typed (#245).
  const style = memo("chapterStyle\u0000" + V.space + "\u0000" + path, () => { const book = bookOfChapter(path); return book ? dialogueStyle(book) : null; });
  if (style) txt.addEventListener("input", e => {
    if (e.isComposing || e.inputType !== "insertText") return;
    const [from, to] = caretOffsets(txt);
    const set = from === to ? typeSet(lineText(txt), from, style) : null;
    if (set) setHostText(txt, set.text, set.caret);
  });
  txt.addEventListener("input", () => {
    /* "· " in front of a note is written out as TODO, which the state words
       below then make a to do there and then (#185). */
    if (!b.state && ACTION_DOT_RE.test(txt.textContent))
      txt.textContent = "TODO " + txt.textContent.replace(ACTION_DOT_RE, "");
    keepLineDraft(node.dataset.space, path, b, lineText(txt));
    paintHeadLine(line, lineText(txt), b.state);
  });
  txt.addEventListener("blur", () => {
    if (FLY && FLY.txt === txt) flyHide();
    const had = b.state ? assigneeOf(b) : "";
    if (commitLine(txt, path, b)) {
      renderNav();
      /* The pills on the line are drawn with it, so a hand-off undone by
         editing the words redraws them here -- not the whole view, which would
         take the caret from wherever the click that left this line put it. */
      if ((b.state ? assigneeOf(b) : "") !== had) {
        const old = line.querySelector(":scope > .props");
        const fresh = lineMeta(b, path);
        if (old && fresh) old.replaceWith(fresh);
        else if (old) old.remove();
        else if (fresh) line.append(fresh);
      }
    }
    dropLineDraft(b.id);
    line.classList.remove("raw");
    paintHeadLine(line, b.title, b.state);
    if (paintTrackerLine(line, txt, path, b)) return;
    /* A line with a dropped picture in it comes back as a path, not a URL, so
       the same pass the redraw runs has to run over the line it just rebuilt --
       otherwise editing a line emptied the picture that was already in it. */
    txt.innerHTML = lineHtml(b, opts.leadCtx);
    resolveAssets(txt);
  });
  /* ---------- pasting a list ----------
     A list that arrives from somewhere else is a list of tasks, so it becomes
     one block per line instead of one block with the whole thing in it. One
     line is still just text at the caret: pasting a word into the middle of a
     sentence has to keep working, and it is the second line that tells us a
     paste was a list. Plain text either way, so a copy out of a web page does
     not bring its fonts and colours with it. */
  /* ---------- dropping a file on a line ----------
     The line is the target, so where the file ends up needs no dialog: it goes
     in assets/ and the line it was dropped on gets the link. */
  txt.addEventListener("dragover", e => {
    if (!Array.from((e.dataTransfer && e.dataTransfer.types) || []).includes("Files")) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
    txt.classList.add("dropping");
  });
  txt.addEventListener("dragleave", () => txt.classList.remove("dropping"));
  txt.addEventListener("drop", e => {
    const files = e.dataTransfer && e.dataTransfer.files;
    txt.classList.remove("dropping");
    if (!files || !files.length) return;
    e.preventDefault();
    e.stopPropagation();
    // A folder is linked where it is; Ctrl links a file the same way.
    const folders = droppedFolders(e.dataTransfer);
    if (folders.length || e.ctrlKey) {
      linkLocalToBlock(path, b, e.ctrlKey ? Array.from(files).map(f => f.name) : folders, txt);
      return;
    }
    attachFilesToBlock(path, b, files, txt);
  });
  txt.addEventListener("paste", e => {
    /* A screenshot in the clipboard arrives as a file, not as text. Words win
       when there are words: a copy out of a spreadsheet carries a picture of
       itself as well, and it is the text that was meant. */
    const raw = e.clipboardData && e.clipboardData.getData("text/plain");
    const files = e.clipboardData ? Array.from(e.clipboardData.files || []) : [];
    if (files.length && !trim(raw || "")) {
      e.preventDefault();
      attachFilesToBlock(path, b, files, txt);
      return;
    }
    if (raw == null) return;
    e.preventDefault();
    if (SUGGEST && SUGGEST.host === txt) suggestClose();
    const whole = lineText(txt);
    const [from, to] = caretOffsets(txt);
    const before = whole.slice(0, from), after = whole.slice(to);

    const lines = raw.replace(/\r\n?/g, "\n").split("\n").filter(l => trim(l) !== "");
    if (lines.length < 2) {
      const one = raw.replace(/[\r\n]+/g, " ");
      setHostText(txt, before + one + after, before.length + one.length);
      suggestSync(txt, {dates: true});
      return;
    }

    const roots = parseOutlineText(raw);
    if (!roots.length) return;
    const inherit = b.state && OPEN_STATES[b.state] ? "TODO" : null;
    const n = readyPastedBlocks(roots, {defaultState: inherit});

    const sibs = siblingsOf(page, b);
    let tail = null;
    // What stays on the line is what is outside the selection being pasted over.
    if (trim(before + after) === "" && !(b.children || []).length) {
      // Pasted into the empty block you just opened: the list takes its place
      // rather than leaving a blank line above itself. A block with children
      // under it is not spare like that, so there the list goes after it.
      txt.blur();
      sibs.splice(sibs.indexOf(b), 1, ...roots);
    } else if (trim(before) === "") {
      /* At the very start of a line that has words on it, the list goes above
         and the line keeps them. Emptying it and rebuilding it underneath
         leaves a blank block where the caret used to be, which is the same
         debris Enter-at-the-start already takes care to avoid. A selection
         from the start is pasted over, so only what follows it stays. */
      txt.textContent = after;
      txt.blur();
      sibs.splice(sibs.indexOf(b), 0, ...roots);
    } else {
      txt.textContent = before;
      txt.blur();
      if (trim(after) !== "") {
        const [st, rest] = splitState(after);
        tail = newBlock({state: st || inherit, title: trim(st ? rest : after)});
        if (tail.state) { applyTodoTemplate(tail); stampAddedIfMissing(path, tail); }
      }
      sibs.splice(sibs.indexOf(b) + 1, 0, ...roots, ...(tail ? [tail] : []));
    }
    touch(path); noteTodoTouched(); render();
    /* A long paste -- an email, notes from a book -- can be a page of its
       own instead: the lines then make way for one line that links it. */
    const said = n + " lines pasted, one block each.";
    if (lines.length < PASTE_AS_LINES) notify(said);
    else offerPasteAs(raw, said + " Make a page of them instead:", pasteSwapper(path, roots, (kind, link) => {
      const line = newBlock({state: inherit, title: link});
      if (line.state) { applyTodoTemplate(line); stampAddedIfMissing(path, line); }
      return line;
    }));
    focusBlock((tail || roots[roots.length - 1]).id);
  });
  /* Names and dates as you type. A date taken from the list is the line's
     due date at once, and the words that said it go. */
  attachSuggest(txt, {dates: true, commands: true,
  /* A slash command. A state is set on the line there and then; everything
     else opens the matching row of the line menu, which already knows how. */
  onCommand: id => {
    if (OPEN_STATES[id] || id === "DONE" || id === "CANCELLED") {
      commitLine(txt, path, b);
      setBlockState(path, b, id);
      if (id === "WAIT" && !assigneeOf(b)) FLY_OPEN_AFTER = {id: b.id, k: "who"};
      focusBlock(b.id, false);
      return;
    }
    // A stage of a task type: the line takes that type and that stage.
    if (id.startsWith(STAGE_CMD)) {
      const [space, list, name] = id.slice(STAGE_CMD.length).split("\u0001");
      commitLine(txt, path, b);
      setTaskStage(path, b, typeHere({space, path: list}), name);
      focusBlock(b.id, false);
      return;
    }
    if (id === "ttype") { commitLine(txt, path, b); txt.blur(); openTaskTypePicker(path, b); return; }
    // A live list or another page shown here: asked in a dialog, written as a macro.
    if (id === "query" || id === "embed") {
      commitLine(txt, path, b);
      txt.blur();
      if (id === "query") openQueryBuilder({onSave: q => putMacroLine(path, b, "{{query " + q + "}}")});
      else openEmbedPicker(path, b);
      return;
    }
    // Opened after the Enter that picked it, which the picker would take as its choice.
    if (id === "run") {
      commitLine(txt, path, b);
      txt.blur();
      setTimeout(() => openRunHere(path, b), 0);
      return;
    }
    if (id === "inform") {
      commitLine(txt, path, b);
      txt.blur();
      setTimeout(() => informFromLine(path, b), 0);
      return;
    }
    /* Somebody came or went: asked in a dialog, written as a #timelog line.
       Opened once the Enter that picked the command is over, or the dialog
       takes that same Enter as Save before anything could be changed. */
    if (id === "in" || id === "out") {
      commitLine(txt, path, b);
      txt.blur();
      setTimeout(() => {
        if (id === "out") timeLogLeave({path, block: b});
        else if (isTimeLog(b)) openTimeForm(path, b);
        else openTimeForm(null, null, {from: {path, block: b}});
      }, 0);
      return;
    }
    // Kill your darlings (#252): at the start of the line the line, else the sentence here.
    if (id === "darling") {
      const t = lineText(txt), [at] = caretOffsets(txt);
      txt.blur();
      if (!trim(t.slice(0, at))) cutLineToDarlings(path, b); else cutSentenceToDarlings(path, b, t, at);
      return;
    }
    // Talk written as a script, put in after this line (#248).
    if (id === "script") {
      commitLine(txt, path, b);
      txt.blur();
      setTimeout(() => openScript({path, after: b}), 0);
      return;
    }
    // A mark, empty, with the caret in it to write in (#246).
    if (BOOK_MARKS[id]) {
      const t = lineText(txt), [at] = caretOffsets(txt), open = "[", close = "]{." + id + "}";
      setHostText(txt, t.slice(0, at) + open + close + t.slice(at), at + open.length);
      return;
    }
    // A beat, or a line again (#244): the %% in front goes on or comes off.
    if (id === "beat") {
      const t = lineText(txt), next = isBeat(t) ? t.replace(BEAT_RE, "") : "%% " + t;
      setHostText(txt, next, next.length);
      paintHeadLine(line, next, b.state);
      return;
    }
    if (!FLY || FLY.txt !== txt) flyShow(txt, path, page, b);
    flyHead(id);
  },
  onDate: (iso, words, r) => {
    commitLine(txt, path, b);
    flyMakeTask(path, b);
    // A time picked after a day goes on that day: "neste onsdag", then "kl 13".
    if (r && r.time && !r.now && dueDate(b)) iso = dueDate(b);
    setDue(b, iso, r && r.time);
    if (r && r.now) setBlockProp(b, "remind", "0");
    touch(path); render(); focusBlock(b.id);
    notify("Due " + humanWhen(iso, r && r.time).toLowerCase() + (r && r.now ? ", reminded then." : "."));
  },
  /* "tracker-" at the start of a line offers the trackers already in use,
     and the wizard for a new one. */
  trackers: true,
  onTrackerWizard: () => {
    txt.blur();
    openTrackerWizard((title, when) => insertTracker(path, b, title, when), path, {path, block: b});
  }});
  /* Typing a state word and a space at the start of a line makes it that kind
     of line there and then -- "TODO " a todo, "WAIT " a waiting-for -- the way
     it already reads once saved, instead of only when you leave the line. */
  txt.addEventListener("input", () => {
    const m = /^(TODO|DOING|WAIT|WAITING|DONE|CANCELLED|CANCELED|LATER|NOW)[\s ]/.exec(txt.textContent);
    if (!m) return;
    const st = STATE_ALIAS[m[1]] || m[1];
    if (FLY && FLY.txt === txt) flyHide();
    b.title = lineText(txt).replace(/^\S+[\s ]+/, "");
    txt.textContent = b.title;
    setBlockState(path, b, st);
    if (st === "WAIT" && !assigneeOf(b)) FLY_OPEN_AFTER = {id: b.id, k: "who"};
    focusBlock(b.id, false);
  });
  txt.addEventListener("input", () => { if (FLY && FLY.txt === txt) { FLY.box.hidden = flyHidden(); flyPlace(); } });
  txt.addEventListener("keydown", e => {
    // The menu under the line, then the suggestion list, own their keys first.
    if (flyKey(e)) return;
    if (suggestKey(e)) return;
    /* Shift+Enter writes a line under the bullet instead of a new bullet: one
       block, several lines, the way a note under a task belongs to it. What is
       after the caret moves down with you, as Enter does with a new bullet. */
    if (e.key === "Enter" && e.shiftKey && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault();
      const whole = lineText(txt);
      const [from, to] = caretOffsets(txt);
      // Blur is what writes the line back, so hand it the half that stays.
      txt.textContent = whole.slice(0, from);
      txt.blur();
      (b.body || (b.body = [])).unshift(trim(whole.slice(to)));
      touch(path); render();
      focusBodyLine(b.id, 0, false);
      centerNewLine(`.blk[data-id="${b.id}"] > .bodyline[data-bi="0"]`);
      return;
    }
    if (e.key === "Enter" && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
      /* Enter cuts the line where the caret is: what is behind the caret stays
         here and what is in front of it goes to the new block. At the end of a
         line -- where Enter usually gets pressed -- that is the same empty new
         block as before, so the familiar case is untouched and the middle of a
         sentence now works too. */
      e.preventDefault();
      const sibs = siblingsOf(page, b);
      const whole = lineText(txt);
      const [from, to] = caretOffsets(txt);
      const before = whole.slice(0, from), after = whole.slice(to);
      const inherit = b.state && OPEN_STATES[b.state] ? "TODO" : null;
      if (from === 0 && to === 0 && trim(whole) !== "") {
        // At the very start: open a line above and leave this one as it is,
        // rather than emptying it and carrying its words down.
        txt.blur();
        const nb = newBlock({state: inherit});
        if (nb.state) { applyTodoTemplate(nb); stampAddedIfMissing(path, nb); }
        sibs.splice(sibs.indexOf(b), 0, nb);
        touch(path); render(); focusBlock(nb.id);
        centerNewLine(`.blk[data-id="${nb.id}"] .txt`);
        return;
      }
      // Blur is what writes a block's text back, so hand it the half that stays.
      txt.textContent = before;
      txt.blur();
      const [st, rest] = splitState(after);
      const nb = newBlock({state: st || inherit, title: trim(st ? rest : after)});
      if (nb.state) { applyTodoTemplate(nb); stampAddedIfMissing(path, nb); }
      if (nb.title) createLinkedPages(nb.title);
      sibs.splice(sibs.indexOf(b) + 1, 0, nb);
      touch(path); render();
      // Caret where the cut was, which is the start of what moved down.
      focusBlock(nb.id, false);
      centerNewLine(`.blk[data-id="${nb.id}"] .txt`);
    } else if (e.key === "Tab") {
      e.preventDefault(); txt.blur();
      const sibs = siblingsOf(page, b), i = sibs.indexOf(b);
      if (e.shiftKey) {
        const par = parentOf(page, b);
        if (par) {
          const gsibs = siblingsOf(page, par);
          sibs.splice(i, 1);
          gsibs.splice(gsibs.indexOf(par) + 1, 0, b);
          touch(path); render(); focusBlock(b.id);
        }
      } else if (i > 0) {
        const prev = sibs[i - 1];
        sibs.splice(i, 1);
        (prev.children || (prev.children = [])).push(b);
        prev.collapsed = false;
        touch(path); render(); focusBlock(b.id);
      }
    } else if (e.altKey && e.shiftKey && (e.key === "ArrowUp" || e.key === "ArrowDown")) {
      /* Move the line among its own siblings, children and all, the way every
         outliner does it. Alt-shift rather than plain alt: the arrows alone
         already walk the blocks, and a key that both moves the caret and
         rearranges the document depending on a modifier you forgot you were
         holding is how a plan gets reordered by accident. */
      e.preventDefault();
      txt.blur();
      if (shiftBlocks(page, [b], e.key === "ArrowUp" ? -1 : 1)) { touch(path); noteTodoTouched(); render(); }
      focusBlock(b.id);
    } else if (e.shiftKey && !e.altKey && !e.ctrlKey && !e.metaKey &&
               (e.key === "ArrowUp" ? caretAtEdge(txt).first : e.key === "ArrowDown" && caretAtEdge(txt).last)) {
      /* Shift and an arrow at the top or bottom of the line has no more text to
         take in, so it goes on and takes in lines instead. */
      e.preventDefault();
      txt.blur();
      lineSelFrom(path, b.id);
      lineSelMove(e.key === "ArrowUp" ? -1 : 1, true);
    } else if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      // Back into the same line afterwards, so ctrl-enter twice means two steps.
      e.preventDefault(); txt.blur(); cycleState(path, b); focusBlock(b.id);
    } else if (e.key === "Backspace" && txt.textContent === "" && !(b.children || []).length) {
      e.preventDefault();
      const sibs = siblingsOf(page, b), i = sibs.indexOf(b);
      const prev = i > 0 ? sibs[i - 1] : null;
      sibs.splice(i, 1);
      touch(path); render();
      if (prev) focusBlock(prev.id);
    } else if (e.key === "Backspace" && !e.shiftKey && !e.altKey && !e.ctrlKey && !e.metaKey &&
               caretOffsets(txt).join() === "0,0" && pullUpLine(txt, path, page, b)) {
      e.preventDefault();
    } else if (e.key === "ArrowUp" && !e.shiftKey && !e.altKey && !e.ctrlKey && !e.metaKey) {
      // Only once there is no line left above inside this block.
      if (caretAtEdge(txt).first && moveToBlock(txt, -1)) e.preventDefault();
    } else if (e.key === "ArrowDown" && !e.shiftKey && !e.altKey && !e.ctrlKey && !e.metaKey) {
      if (caretAtEdge(txt).last && moveToBlock(txt, 1)) e.preventDefault();
    } else if (e.key === "Escape") {
      // Out of the words and onto the line itself, so shift and the arrows can
      // pick more lines and alt-shift and the arrows can move them.
      txt.blur();
      lineSelFrom(path, b.id);
    }
  });
  line.append(txt);
  /* Pressing it must not take the caret out of the line, or the blur would
     close the very menu it is opening. */
  line.append(el("button", {class: "linemenu", tabindex: "-1", title: "Line menu (Ctrl+.)", "aria-label": "Line menu",
    "aria-haspopup": "menu", "aria-expanded": "false",
    onmousedown: e => e.preventDefault(),
    onclick: e => { e.stopPropagation(); flySummon(txt); }}, "⋯"));
  paintTrackerLine(line, txt, path, b);
  node.append(line);

  // On the line, at its right end, so a line with pills takes one row, not two.
  const meta = lineMeta(b, path, ro);
  if (meta) line.append(meta);
  (b.body || []).forEach((l, i) => node.append(bodyLineEl(path, b, i)));
  const shown = liveMacros(path, b);
  if (shown) node.append(shown);

  if (!b.collapsed) for (const k of kids) node.append(outlineBlock(path, page, k, opts));
  return node;
}
