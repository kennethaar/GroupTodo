function viewHelp() {
  const id = HELP[state.helpTopic] ? state.helpTopic : "start";
  const c = el("div", {class: "wrap wide helpview"});
  c.append(vhead("Help", "Search, or pick a topic.",
    el("button", {class: "textbtn", title: "Read this topic at the right while you use the app",
      onclick: () => helpBeside(id)}, "Read beside")));
  const grid = el("div", {class: "helpgrid" + (HELP_Q ? " toc-open" : "")});
  const toc = el("nav", {class: "helptoc", "aria-label": "Contents"});
  const drawToc = () => {
    const hits = helpSearch(HELP_Q);
    toc.replaceChildren();
    if (!hits.length) { toc.append(el("p", {class: "quiet"}, "Nothing matches. Try another word.")); return; }
    if (trim(HELP_Q)) {
      toc.append(el("ul", {}, ...hits.map(h => helpTocItem(h, id))));
      return;
    }
    for (const [part, label] of HELP_PARTS) {
      const mine = hits.filter(h => HELP[h].part === part);
      if (mine.length) toc.append(el("h3", {}, label), el("ul", {}, ...mine.map(h => helpTocItem(h, id))));
    }
  };
  const input = el("input", {type: "search", class: "helpq", placeholder: "Search the help", "aria-label": "Search the help",
    value: HELP_Q,
    oninput: e => { HELP_Q = e.target.value; grid.classList.add("toc-open"); drawToc(); },
    onkeydown: e => {
      if (e.key === "Enter") { const first = helpSearch(HELP_Q)[0]; if (first) { e.preventDefault(); openHelp(first); } }
      else if (e.key === "Escape" && e.target.value) { e.preventDefault(); e.stopPropagation(); HELP_Q = ""; e.target.value = ""; drawToc(); }
    }});
  drawToc();
  grid.append(el("div", {class: "helpside"}, input,
    el("button", {class: "btn sm ghost helpcontents", "aria-expanded": String(!!HELP_Q),
      onclick: e => e.currentTarget.setAttribute("aria-expanded", String(grid.classList.toggle("toc-open")))}, "Contents"),
    toc),
    el("article", {class: "helpbody"}, helpTopicNode(id)));
  c.append(grid);
  return c;
}
