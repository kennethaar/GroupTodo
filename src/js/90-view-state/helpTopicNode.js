/* One topic. here: drawn as "This page" beside the screen it is about, where
   the legend's numbers point at the screen and no picture of it is needed.
   read(id) is where its links go: the full help, or the pane. */
function helpTopicNode(id, {here = false, read = openHelp} = {}) {
  const t = HELP[id] || HELP.start;
  const box = el("div", {class: "helptopic"});
  box.append(el("div", {class: "helpeyebrow"}, here ? "This page" : (HELP_PARTS.find(p => p[0] === t.part) || [, ""])[1],
    t.gtd ? el("span", {class: "helpgtd", title: "Where this sits in Getting Things Done"}, "GTD · ", GTD_STEP[t.gtd]) : null));
  box.append(el("h2", {}, t.title), el("p", {class: "helpwhat"}, t.what));
  if (!here) box.append(helpShot(id));
  if (t.steps && t.steps.length) {
    box.append(el("h3", {}, here ? "What you can do" : "How"));
    box.append(el("ol", {class: "helpsteps"}, ...t.steps.map(s => {
      const [text, sel] = [].concat(s);
      return el("li", {}, text, here && sel ? el("button", {class: "textbtn helpshow",
        onclick: () => helpFlash(sel)}, "Show me") : null);
    })));
  }
  if (t.keys && t.keys.length) box.append(el("h3", {}, "Keys"), helpKeys(t.keys));
  if (t.code && t.code.length) box.append(el("h3", {}, "Written as"), helpCode(t.code));
  if (t.legend && t.legend.length) {
    box.append(el("h3", {}, "What you see"));
    box.append(el("ol", {class: "helplegend"}, ...t.legend.map(([sel, text], i) => el("li", {data: {n: String(i)}},
      el("button", {class: "hnum", title: here || helpOnScreen(id) ? "Show it on the screen" : "Show it on its page",
        onclick: () => helpOnScreen(id) && helpOpen() ? helpExplain(i) : helpGoShow(id, i)}, String(i + 1)), el("span", {}, text)))));
  }
  if (t.more && t.more.length) box.append(el("details", {class: "helpmore"}, el("summary", {}, "More"),
    el("ul", {}, ...t.more.map(m => el("li", {}, m)))));
  if (id === "news") box.append(helpNews());
  const see = (t.see || []).filter(s => HELP[s]);
  box.append(el("h3", {}, here ? "Learn more" : "See also"), el("div", {class: "helpsee"},
    ...see.map(s => helpLink(s, read)),
    here ? el("button", {class: "textbtn", onclick: () => openHelp(id)}, "Open full help") : null,
    !here && t.view && t.view !== "help" && t.view !== "page" ? el("button", {class: "textbtn",
      onclick: () => helpGoShow(id, null)}, "Go there") : null));
  return box;
}
