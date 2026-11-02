/* ---------- the picker ---------- */
function openDependsPicker(path) {
  const current = dependsOn(path);
  const choices = allPages(p => statusDirOf(p) && p !== path && !isHorizonPage(p))
    .filter(p => current.includes(p) || !wouldCycle(path, p))
    .sort((a, b) => (statusDirOf(a) + pageTitle(a)).localeCompare(statusDirOf(b) + pageTitle(b)));

  const pick = new Set(current);
  const card = el("div", {style: "max-height:46vh;overflow:auto"});
  const summary = el("div", {style: "color:var(--fg3);font-size:12.5px;margin-top:8px"});

  const refresh = () => {
    summary.textContent = pick.size
      ? pageTitle(path) + " starts after " + Array.from(pick).map(pageTitle).join(", ")
      : "Nothing comes first - this project can start whenever you like.";
  };

  /* Typed words narrow the list, the same as the children picker: every word
     must be in the title, in any order. Arrows move, Enter ticks the lit row,
     Ctrl+Enter saves. */
  let shown = choices, sel = 0;
  const toggle = p => { if (pick.has(p)) pick.delete(p); else pick.add(p); draw(); refresh(); };
  function draw() {
    card.textContent = "";
    if (!choices.length) {
      card.append(el("div", {class: "empty"},
        "No other project could come first. Make one and it will show up here."));
      return;
    }
    if (!shown.length) card.append(el("div", {class: "empty"}, "No matches."));
    shown.forEach((p, i) => {
      const on = pick.has(p);
      const row = el("div", {style: "display:flex;gap:10px;align-items:center;margin:6px 0;padding:2px 4px;border-radius:6px" +
                                     (i === sel ? ";background:var(--bg3)" : "")},
        el("button", {class: "spacetoggle" + (on ? " on" : ""), onclick: () => { sel = i; toggle(p); }}, on ? "✓" : ""),
        el("div", {style: "min-width:0;flex:1"},
          el("div", {}, pageTitle(p)),
          el("div", {style: "color:var(--fg3);font-size:12px"},
            STATUS_LABEL[statusDirOf(p)] +
            (projectCleared(p) ? " · finished" : " · still open") +
            (projectEnd(p) ? " · ends " + projectEnd(p) : ""))));
      card.append(row);
      if (i === sel) requestAnimationFrame(() => row.scrollIntoView({block: "nearest"}));
    });
  }
  const filter = el("input", {
    placeholder: "filter...",
    oninput: e => {
      const words = trim(e.target.value).toLowerCase().split(/\s+/).filter(Boolean);
      shown = choices.filter(p => { const t = pageTitle(p).toLowerCase(); return words.every(w => t.includes(w)); });
      sel = 0; draw();
    },
  });
  draw();
  refresh();

  const save = () => {
    writeDependsOn(path, Array.from(pick));
    closeModal();
    const late = earliestStart(path);
    const start = projectStart(path);
    if (late && start && start < late)
      notify(pageTitle(path) + " now starts before what it waits on. Drag its bar on the " +
             "Timeline, or let the chain push it.", "warn",
             {label: "Push it", run: () => { pushProjectTo(path, late); render(); }});
    else notify(pick.size ? "Chain saved." : "Chain cleared.");
    render();
  };

  modal({
    center: true, title: "What has to finish first?",
    hint: pageTitle(path) + " · type to filter · enter ticks · ctrl+enter saves",
    onKey: e => {
      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) { save(); return true; }
      if (e.key === "Enter") { if (shown[sel]) toggle(shown[sel]); return true; }
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        if (shown.length) { sel = (sel + (e.key === "ArrowDown" ? 1 : -1) + shown.length) % shown.length; draw(); }
        return true;
      }
      if (document.activeElement === filter) return false;
      if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) { filter.focus(); return false; }
      return false;
    },
    body: el("div", {},
      el("div", {class: "field"},
        el("label", {}, "Prerequisites"),
        el("div", {class: "filterbox"}, filter),
        card, summary),
      el("div", {class: "field"},
        el("div", {style: "color:var(--fg3);font-size:12.5px"},
          "Saved as depends_on:: on the page - one line of markdown, so the order " +
          "travels with the files. A project that would depend on itself, however long " +
          "the way round, is not offered."))),
    foot: [
      el("button", {class: "btn ghost", onclick: closeModal}, "Cancel"),
      el("button", {class: "btn primary", onclick: save}, "Save chain"),
    ],
  });
  requestAnimationFrame(() => filter.focus());
}
