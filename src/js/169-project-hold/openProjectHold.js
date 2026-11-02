function openProjectHold(path) {
  const was = holdValue(getPage(path)?.props?.hold);
  const input = el("input", {type: "date", min: shiftISO(todayISO(), 1),
    value: was && was !== HOLD_OPEN ? was : ""});
  const open = el("input", {type: "checkbox", checked: was === HOLD_OPEN,
    onchange: () => { input.disabled = open.checked; }});
  input.disabled = open.checked;
  const save = () => {
    if (!open.checked && !input.value) return;
    closeModal(); setProjectHold(path, open.checked ? HOLD_OPEN : input.value);
  };
  modal({
    center: true, title: "Hold " + pageTitle(path),
    body: el("div", {},
      el("div", {class: "field"}, el("label", {}, "Out of sight until"), input),
      el("label", {style: "display:flex;gap:6px;align-items:center;font-size:13px;margin-bottom:8px"},
        open, "No date: until I take it off"),
      el("div", {style: "color:var(--fg3);font-size:12px"},
        "Its actions leave your lists and it moves to On hold. On the day it comes back by itself; " +
        "with no date it stays on hold until you bring it back.")),
    foot: [
      projectHold(path) ? el("button", {class: "btn ghost", onclick: () => { closeModal(); setProjectHold(path, null); }}, "Bring it back now") : null,
      el("div", {style: "flex:1"}),
      el("button", {class: "btn ghost", onclick: closeModal}, "Cancel"),
      el("button", {class: "btn primary", onclick: save}, "Hold")],
    onKey: e => { if (e.key === "Enter") { save(); return true; } return false; },
  });
  setTimeout(() => input.focus(), 30);
}
