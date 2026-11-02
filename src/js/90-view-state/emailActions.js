/* On the page itself, not only in its menu: answering is what the page is for. */
function emailActions(path) {
  const b = (label, run) => el("button", {class: "btn sm ghost", onclick: run}, label);
  return el("div", {class: "mailacts", style: "display:flex;gap:8px;flex-wrap:wrap;margin:6px 0 10px"},
    b("Reply", () => openMailNote(path, "reply")),
    b("Ask for news", () => openMailNote(path, "ask")),
    b("Forward", () => openMailNote(path, "forward")),
    b("Add their answer", () => openMailAnswer(path)),
    b("Plan it with an AI", () => openPlanWithAI(planSourceOfEmail(path))));
}
