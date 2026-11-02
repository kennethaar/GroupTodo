function openQueryBuilder({query = "", space = V.space, onSave}) {
  const parsed = qbFromQuery(query);
  const st = parsed || {mode: "and", rows: []};
  let asText = !parsed;
  if (!st.rows.length && !asText) st.rows.push({kind: "task", states: ["TODO", "DOING"], a: "", b: "", not: false});
  const pageList = el("datalist", {id: "qbPages"}, ...inSpace(space, () => allPages(p => !isJournalPath(p)).slice(0, 2000)
    .map(p => el("option", {value: linkRefTo(p)}, pageTitle(p)))));
  const rowsBox = el("div", {class: "qbrows"});
  const textBox = el("textarea", {class: "qbtext", spellcheck: "false", rows: "3",
    placeholder: "(and [[1/Fix sink]] (task TODO DOING))"});
  textBox.value = query;
  const preview = el("div", {class: "qbpreview", "aria-live": "polite"});
  const modeBox = el("div", {class: "qbmode"});
  const current = () => asText ? trim(textBox.value) : qbText(st);

  let timer = null;
  const refresh = () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      const q = current();
      if (!asText) textBox.value = q;
      preview.textContent = "";
      if (!q) { preview.append(el("span", {class: "hint"}, "Add something to look for.")); return; }
      let res;
      try { res = inSpace(space, () => runQuery(q)); } catch (err) { preview.append(el("span", {class: "bad"}, "Could not read that: " + (err.message || err))); return; }
      preview.append(el("b", {}, res.rows.length + (res.pages ? (res.rows.length === 1 ? " page" : " pages") : (res.rows.length === 1 ? " line" : " lines"))),
        (res.rows.length === 1 ? " matches now" : " match now") + (res.rows.length ? ", for example:" : "."));
      for (const r of res.rows.slice(0, 6)) preview.append(el("div", {class: "qbhit"},
        stateChip(r.block?.state, r.block),
        el("span", {}, r.block ? plainTitle(r.block.title) || "(empty line)" : inSpace(space, () => pageTitle(r.path))),
        el("span", {class: "p"}, inSpace(space, () => pageTitle(r.path)))));
    }, 120);
  };

  const input = (value, ph, onInput, list) => {
    const i = el("input", {value: value || "", placeholder: ph, spellcheck: "false", list: list || null,
      oninput: e => { onInput(e.target.value); refresh(); }});
    return i;
  };
  const drawRows = () => {
    rowsBox.textContent = "";
    st.rows.forEach((r, n) => {
      const kind = el("select", {"aria-label": "What to match", onchange: e => {
        Object.assign(r, {kind: e.target.value, a: "", b: "", states: e.target.value === "task" ? ["TODO", "DOING"] : []});
        drawRows(); refresh();
      }}, ...QB_KINDS.map(([v, l]) => el("option", {value: v, selected: v === r.kind ? "" : null}, l)));
      const what = el("div", {class: "qbwhat"});
      if (r.kind === "task") {
        for (const s of TODO_STATES) what.append(el("label", {class: "qbstate"},
          el("input", {type: "checkbox", checked: r.states.includes(s) ? "" : null, onchange: e => {
            r.states = e.target.checked ? [...r.states, s] : r.states.filter(x => x !== s);
            r.states = TODO_STATES.filter(x => r.states.includes(x));
            refresh();
          }}), el("span", {class: "state " + s}, s)));
      } else if (r.kind === "link" || r.kind === "page") {
        what.append(input(r.a, r.kind === "link" ? "page, e.g. 1/Fix sink or p/Ola" : "page name", v => { r.a = v; }, "qbPages"));
      } else if (r.kind === "tag") {
        what.append(input(r.a, "tag, e.g. urgent", v => { r.a = v; }));
      } else if (r.kind === "text") {
        what.append(input(r.a, "words", v => { r.a = v; }));
      } else if (r.kind === "prop" || r.kind === "pageprop") {
        what.append(input(r.a, "key, e.g. type", v => { r.a = v; }),
          el("span", {class: "qbeq"}, "="), input(r.b, "value (empty: any)", v => { r.b = v; }));
      } else if (r.kind === "between") {
        what.append(input(r.a, "from, e.g. -7d", v => { r.a = v; }),
          el("span", {class: "qbeq"}, "to"), input(r.b, "today", v => { r.b = v; }));
      }
      rowsBox.append(el("div", {class: "qbrow"}, kind, what,
        el("label", {class: "qbnot", title: "Lines that do NOT match this"},
          el("input", {type: "checkbox", checked: r.not ? "" : null, onchange: e => { r.not = e.target.checked; refresh(); }}), "not"),
        el("button", {class: "textbtn", title: "Take this away", "aria-label": "Take this away",
          onclick: () => { st.rows.splice(n, 1); drawRows(); refresh(); }}, "✕")));
    });
    rowsBox.append(el("button", {class: "btn sm ghost", onclick: () => {
      st.rows.push({kind: "link", states: [], a: "", b: "", not: false}); drawRows(); refresh();
      rowsBox.querySelector(".qbrow:last-of-type input")?.focus();
    }}, "+ something else to match"));
  };
  const drawMode = () => {
    modeBox.textContent = "";
    if (asText) return;
    for (const [v, l] of [["and", "All of these"], ["or", "Any of these"]])
      modeBox.append(el("label", {class: "qbstate"},
        el("input", {type: "radio", name: "qbmode", checked: st.mode === v ? "" : null,
          onchange: () => { st.mode = v; refresh(); }}), l));
  };
  const toggle = el("button", {class: "textbtn", onclick: () => {
    if (!asText) { asText = true; }
    else {
      const back = qbFromQuery(textBox.value);
      if (!back) { notify("The form has no rows for some of that, so it stays as text.", "warn"); return; }
      Object.assign(st, back); asText = false;
    }
    draw(); refresh();
  }});
  const draw = () => {
    toggle.textContent = asText ? "Back to the form" : "Edit as text";
    rowsBox.hidden = asText;
    textBox.readOnly = !asText;
    textBox.classList.toggle("ro", !asText);
    drawMode(); if (!asText) drawRows();
  };
  textBox.addEventListener("input", () => { if (asText) refresh(); });
  const save = () => {
    const q = current();
    if (!q) { notify("There is nothing to look for yet.", "warn"); return; }
    closeModal(); onSave(q);
  };
  draw(); refresh();
  modal({
    center: true, title: query ? "Edit the query" : "A live list", hint: "lines that match, kept up to date",
    body: el("div", {class: "qb"}, pageList, modeBox, rowsBox,
      el("div", {class: "field"}, el("label", {}, "The query, as written in the line ", toggle), textBox),
      preview),
    foot: [el("button", {class: "btn ghost", onclick: closeModal}, "Cancel"),
           el("button", {class: "btn primary", onclick: save}, query ? "Save" : "Put it in the line")],
    onKey: e => { if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) { save(); return true; } return false; },
  });
  setTimeout(() => (asText ? textBox : $(".qbrow input, .qbrow select"))?.focus(), 40);
}
