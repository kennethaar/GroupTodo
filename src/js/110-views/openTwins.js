/* The look-alikes, every group at once: open any of them, and for each say
   fold them into one (the one you keep takes the lines and fills its empty
   values from the others) or they are different and stop being flagged, and
   move any of them to the area it belongs in. Nothing is chosen for you, a
   second click on a choice takes it back, no choice undoes another, and a
   group with no choice is left as it is. A move asks what comes along right
   here, so every question is answered before Apply does it all in one go.
   Folded, the project ends up where the kept one's Move says. */
function openTwins(only = null) {
  const groups = only ? [only] : projectTwins();
  if (!groups.length) { notify("No projects look alike."); return; }
  const body = el("div", {class: "twins"});
  const allAreas = Spaces.list.map(s => s.name);
  const plans = [];                    // per group: what to do with it
  const applyBtn = el("button", {class: "btn primary", onclick: () => apply()});
  const count = () => {
    const n = plans.filter(p => p.ready()).length;
    applyBtn.textContent = n ? "Apply " + n : "Apply";
    applyBtn.disabled = !n;
  };
  // The same transfer as Alt+S, answered here, and undone the same way.
  const moveTo = async (path, from, to, choice) => {
    try { return !!(await transferLinkedPages([{path, from}], to, {mode: "move", choice})); }
    catch (e) { notify("The move did not finish: " + e.message, "error"); return false; }
  };
  const apply = async () => {
    closeModal();
    const not = twinNotSame();
    for (const p of plans) if (p.ready() && p.act === "not") p.pairs().forEach(k => not.add(k));
    PREF.set("twins.not", JSON.stringify([...not]));
    for (const p of plans) if (p.ready()) await p.run();
    clearMemo(); render();
  };
  /* A radio drawn from the dialog's own state, not the browser's: clicking
     the one already chosen clears it, and every click redraws from the state. */
  const choice = (name, on, label, onClick) => el("label", {class: "space-transfer-choice"},
    el("input", {type: "radio", name, checked: on, onclick: onClick}), " " + label);
  groups.forEach((g, gi) => {
    let keep = null;
    const areas = [...new Set(g.rows.map(r => r.space))];
    const moves = new Map();           // row -> area it is moved to
    const xfers = new Map();           // "row>area" -> its transfer questions, answers kept while you change others
    const plan = {act: null,
      ready: () => plan.act === "not" || (plan.act === "fold" ? !!keep : moves.size > 0)};
    plans.push(plan);
    const rowsEl = el("div", {class: "twinrows"});
    const areaEl = el("div", {class: "twinarea"});
    const warnEl = el("div", {class: "twinwarn"});
    const actEl = el("div", {class: "twinacts"});
    const xferEl = el("div", {class: "twinxfers"});
    const redraw = () => { draw(); drawArea(); drawXfers(); drawAct(); count(); };
    const setAct = v => { plan.act = plan.act === v ? null : v; redraw(); };
    const folding = () => plan.act === "fold" && keep;
    const destOf = () => moves.get(keep) || keep.space;
    const xferOf = (r, to) => {
      const k = g.rows.indexOf(r) + ">" + to;
      if (!xfers.has(k)) xfers.set(k, boundedTransferFields(boundedTransferPlan(r.path, r.space), to, {mode: "move"},
        "twin-xfer-" + gi + "-" + k));
      return xfers.get(k);
    };
    // The moves Apply will make: [row, area it goes to]. Folding, only the kept one
    // can move -- and only out of the group's areas, since a fold carries it within them.
    const pending = () => folding() ? (areas.includes(destOf()) ? [] : [[keep, destOf()]]) : [...moves];
    const drawXfers = () => {
      xferEl.textContent = "";
      for (const [r, to] of pending())
        xferEl.append(el("div", {class: "twinxfer"}, el("b", {}, "Moving " + r.title + " to " + to), xferOf(r, to).body));
    };
    const drawAct = () => {
      actEl.textContent = "";
      actEl.append(
        choice("twin-act-" + gi, plan.act === "fold", "Fold into the one kept", () => setAct("fold")),
        choice("twin-act-" + gi, plan.act === "not", "Not the same", () => setAct("not")),
        plan.act === "fold" && !keep ? el("span", {class: "twinwarn"}, "Pick the one to keep") : null);
    };
    const drawArea = () => {
      areaEl.textContent = "";
      warnEl.textContent = "";
      if (!folding() || allAreas.length < 2) return;
      const dest = destOf();
      areaEl.append(el("span", {}, "Ends up in " + dest + ": change it with Move on the kept one."));
      // Folded where the kept one is, then moved on: only the areas folded from keep a synced copy.
      const away = areas.includes(dest) ? null : keep.space;
      const warns = areas.filter(a => a !== dest && a !== away).map(a => [a, othersIn(a)]).filter(([, who]) => who.length)
        .map(([a, who]) => (who.length > 3 ? who.slice(0, 3).join(", ") + " and " + (who.length - 3) + " more"
          : who.join(", ").replace(/, ([^,]*)$/, " and $1")) + " also work in " + a +
          ". The project stays there as a synced copy, so they keep it: an edit in one area is the edit in both.");
      if (away) warns.push({plain: "It is folded in " + away + ", then moved to " + dest + "."});
      warnEl.append(...warns.map(w => el("div", {}, w.plain ? w.plain : [svgIcon(ICON_WARN), " " + w])));
    };
    const draw = () => {
      rowsEl.textContent = "";
      for (const r of g.rows) {
        const here = r === keep;
        // Picking the one to keep means fold; picking it again takes both back.
        const pickKeep = () => {
          if (here) { keep = null; if (plan.act === "fold") plan.act = null; }
          else { keep = r; plan.act = "fold"; }
          redraw();
        };
        let move = null;
        if (allAreas.length > 1) {
          move = fselect("Move " + r.title + " to another area", moves.get(r) || "",
            [["", "Stays in " + r.space], ...allAreas.filter(a => a !== r.space).map(a => [a, "Move to " + a])],
            async v => {
              // The questions need the area open to know what is already there.
              if (v && !LOADED.has(v)) try { await loadSpaceRecord(v); }
                catch (_) { notify("Cannot open " + v + ".", "error"); move.value = moves.get(r) || ""; return; }
              if (v) moves.set(r, v); else moves.delete(r);
              redraw();
            });
          // Folded into the kept one, it goes where that one goes; its own choice waits.
          if (folding() && !here) { move.disabled = true; move.title = "Folded into the one kept"; }
        }
        rowsEl.append(el("label", {class: "twinrow" + (here ? " keep" : "")},
          el("input", {type: "radio", name: "twin-keep-" + gi, checked: here, onclick: pickKeep}),
          el("span", {class: "twint"}, r.title),
          el("span", {class: "chip"}, STATUS_LABEL[r.code]),
          multiSpace() ? spaceBadge(r.space) : null,
          move,
          el("button", {class: "textbtn", onclick: e => { e.preventDefault(); closeModal(); previewPage(r.space, r.path); }}, "Open")));
      }
    };
    redraw();
    plan.run = async () => {
      if (plan.act === "fold") {
        const dest = destOf(), home = areas.includes(dest) ? dest : keep.space;
        if (g.rows.every(r => r.space === home)) {
          let n = 0;
          for (const r of g.rows) if (r !== keep && inSpace(home, () => mergePageInto(r.path, keep.path))) n++;
          if (!n) { notify("Nothing folded."); return; }
        } else if (!await foldTwinsAcrossAreas(g.rows, keep, home)) return;
        if (home !== dest) await moveTo(keep.path, home, dest, xferOf(keep, dest).collect());
      } else for (const [r, to] of moves) await moveTo(r.path, r.space, to, xferOf(r, to).collect());
    };
    plan.pairs = () => {
      const keys = [];
      for (let i = 0; i < g.rows.length; i++)
        for (let j = i + 1; j < g.rows.length; j++) keys.push(twinPairKey(g.rows[i].title, g.rows[j].title));
      return keys;
    };
    body.append(el("div", {class: "twingroup"},
      el("div", {class: "twinwhy"}, g.rows.length + " projects with " + g.why + ". Pick the one to keep, and move any to its area:"),
      rowsEl, areaEl, warnEl, xferEl, actEl));
  });
  count();
  modal({title: only ? "Looks like another project" : "Projects that look alike", body,
    foot: [el("button", {class: "btn ghost", onclick: closeModal}, "Close"), applyBtn]});
}
