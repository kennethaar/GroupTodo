/* The same list as plain text, to paste into a message or a meeting agenda. */
function showWaitingFeedback() {
  const rows = globalPeopleRows().filter(r => r.items.length);
  const text = rows.map(r => r.name + "\n" + r.items.map(a =>
    "- " + plainTitle(a.title) + " [" + a.space + " / " + a.path + "]").join("\n")).join("\n\n");
  const input = el("textarea", {readonly: true, style: "width:100%;min-height:50vh",
    "aria-label": "Everything you are waiting for"});
  input.value = text || "Nothing is waiting on anybody.";
  modal({
    title: "Everything you are waiting for", body: el("div", {class: "field"}, input),
    foot: [
      el("button", {class: "btn ghost", onclick: () => copyText(input.value, "List copied.", "Copy the list")}, "Copy"),
      el("button", {class: "btn", onclick: closeModal}, "Close"),
    ],
  });
}
