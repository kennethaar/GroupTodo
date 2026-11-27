function drawHelpPane() {
  SIDE_SHOWN = null;
  const pane = $("#pagePane"), here = HELP_SIDE === "page";
  const id = here ? helpTopicHere() : HELP_SIDE;
  if (pane.dataset.help !== id) pane.scrollTop = 0;
  pane.dataset.help = id;
  const legend = (HELP[id].legend || []).length && helpOnScreen(id);
  pane.replaceChildren(el("div", {class: "panebar"},
    // The way to search and the contents, said in words: a bare ⤢ went unseen on a phone (#512).
    el("button", {class: "btn sm ghost", title: "Search the help, or pick a topic", onclick: () => openHelp(id)}, "All help"),
    here ? null : el("button", {class: "textbtn", onclick: () => setHelp(true)}, "‹ This page"),
    legend ? el("button", {class: "btn sm" + (HELP_MARKS ? " primary" : " ghost"), "aria-pressed": String(HELP_MARKS),
      title: "Put numbers on the screen (s)", onclick: () => helpMarks(!HELP_MARKS)}, "Show me") : null,
    el("div", {style: "flex:1"}),
    el("button", {class: "iconbtn", title: "Close (Esc)", "aria-label": "Close", onclick: () => setHelp(false)}, "✕")),
    el("div", {class: "helppane"}, helpTopicNode(id, {here, read: helpBeside})));
  pane.classList.remove("pinned");
  pane.hidden = false;
  document.body.classList.add("pane-open");
  pane.querySelectorAll("img").forEach(i => i.decoding = "async");
  requestAnimationFrame(helpMarksDraw);
}
