function helpNews() {
  const box = el("div", {class: "helpnews"}, el("p", {class: "quiet"}, "This is v" + APP_VERSION + "."));
  for (const e of HELP_NEWS.split(/^## /m).slice(1)) {
    const [head, ...rest] = e.split("\n");
    const items = rest.join("\n").split(/^- /m).slice(1).map(x => x.replace(/\s+/g, " ").replace(/[`*]/g, "").trim());
    box.append(el("h3", {}, head.trim()), el("ul", {}, ...items.map(x => el("li", {}, x))));
  }
  return box;
}
