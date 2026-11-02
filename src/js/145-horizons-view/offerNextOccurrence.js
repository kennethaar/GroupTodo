function offerNextOccurrence(path, block) {
  const spec = repeatOf(block);
  const when = nextRepeatDate(spec, dueDate(block) || todayISO());
  if (!when) return;
  /* Who does the next one: whoever's turn it is, or the same person again. */
  const turn = whoseTurn(block);
  const forSel = turn ? el("select", {},
    ...members().map(m => el("option", {value: m.name}, m.me ? m.name + " (you)" : m.name))) : null;
  if (forSel) forSel.value = turn;
  nudgeToast({
    center: true, title: "Again?",
    body: el("div", {},
      el("div", {class: "field"},
        el("div", {style: "font-size:13.5px"},
          "\u201C" + titleForRow(block.title) + "\u201D repeats " + spec + "."),
        el("div", {style: "color:var(--fg2);font-size:13px;margin-top:6px"},
          "Put the next one on " + humanDate(when) + "?"),
        forSel ? el("div", {class: "field", style: "margin-top:8px"},
          el("label", {}, "Whose turn (fewest lately)"), forSel) : null,
        el("div", {style: "color:var(--fg3);font-size:12px;margin-top:8px"},
          "Nothing is created until you say so, so a week you skipped stays skipped. " +
          "You will never come back to a pile of chores you were not there for."))),
    foot: [
      el("button", {class: "btn ghost", onclick: () => { closeModal(); render(); }}, "Leave it"),
      el("div", {style: "flex:1"}),
      el("button", {class: "btn primary", onclick: () => {
        closeModal();
        const copy = makeNextOccurrence(path, block, when);
        if (copy && forSel) assignBlock(path, copy, forSel.value);
        render();
        notify(forSel ? "Next one on " + humanDate(when) + ", for " + forSel.value + "."
          : "Next one on " + humanDate(when) + ".");
      }}, "Yes, " + humanDate(when)),
    ],
  });
}
