function helpNews() {
  const box = el("div", {class: "helpnews"}, el("p", {class: "quiet"}, "This is v" + APP_VERSION + ".",
    " ", el("button", {class: "textbtn", onclick: () => checkForUpdate({quiet: false})}, "Look for a newer one")));
  for (const e of newsEntries(HELP_NEWS))
    box.append(el("h3", {}, e.version + (e.date ? " - " + e.date : "")), el("ul", {}, ...e.items.map(x => el("li", {}, x.text))));
  box.append(feedbackBox());
  return box;
}
