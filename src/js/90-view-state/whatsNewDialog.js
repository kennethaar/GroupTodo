function whatsNewDialog(entries, {update = null, since = null} = {}) {
  const shown = newsEntries(HELP_NEWS);
  const gap = since && shown.length && verCmp(shown[shown.length - 1].version, since) > 0;
  const body = el("div", {class: "whatsnew"},
    el("p", {class: "quiet"}, update
      ? thingsCount(entries) + " waiting for you, since your v" + APP_VERSION + "."
      : thingsCount(entries) + (since ? " since v" + since : "") + ". Here is what you can do now."));
  for (const e of entries) {
    body.append(el("h3", {}, "v" + e.version, e.date ? el("span", {class: "quiet"}, " · " + e.date) : null));
    body.append(el("ul", {}, ...e.items.map(x => {
      const topic = update ? null : newsTopic(x);
      return el("li", {},
        x.head ? el("strong", {}, x.head + ":") : null,
        x.head ? " " + x.text.slice(x.text.indexOf(":") + 1).trim() : x.text,
        el("span", {class: "newsacts"},
          topic ? el("button", {class: "textbtn", title: HELP[topic].title,
            onclick: () => { closeModal(); openHelp(topic); }}, "How it works") : null,
          x.issue ? el("a", {class: "textbtn", href: REPO_URL + "/issues/" + x.issue, target: "_blank", rel: "noopener"},
            "#" + x.issue) : null));
    })));
  }
  if (gap) body.append(el("p", {class: "quiet"}, "And more before that: ",
    el("a", {href: REPO_URL + "/blob/main/CHANGELOG.md", target: "_blank", rel: "noopener"}, "the full list on GitHub"), "."));
  body.append(feedbackBox());
  modal({title: update ? "Coming in v" + update.version : "What's new in v" + APP_VERSION, body,
    foot: update
      ? [el("button", {class: "btn ghost", onclick: closeModal}, "Later"),
         el("button", {class: "btn primary", onclick: () => { closeModal(); getUpdate(update.version); }},
           UPDATE_HOSTED ? "Update now" : "Download now")]
      : [el("button", {class: "btn primary", onclick: closeModal}, "Let's go")]});
}
