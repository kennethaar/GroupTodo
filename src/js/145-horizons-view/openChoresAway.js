function openChoresAway() {
  const day = el("input", {type: "date", value: shiftISO(todayISO(), 7), min: shiftISO(todayISO(), 1), "aria-label": "Back on"});
  const set = until => { closeModal(); holdChores(until); };
  modal({
    center: true, title: "Away until…",
    body: el("div", {class: "field"},
      el("div", {style: "display:flex;flex-wrap:wrap;gap:6px;margin-bottom:10px"},
        ...[["A weekend", 3], ["A week", 7], ["Two weeks", 14]].map(([label, n]) =>
          el("button", {class: "fchip", onclick: () => set(shiftISO(todayISO(), n))}, label))),
      el("label", {}, "Or the day you are back"), day),
    foot: [el("button", {class: "btn ghost", onclick: () => closeModal()}, "Cancel"),
      el("div", {style: "flex:1"}),
      el("button", {class: "btn primary", onclick: () => day.value > todayISO() ? set(day.value) : day.focus()}, "Away")],
  });
}
