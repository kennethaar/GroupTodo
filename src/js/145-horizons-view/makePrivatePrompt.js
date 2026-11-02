/* ---------- taking something back out of a shared space ----------
   "Private" is not a flag on a page: anyone with the folder can read the
   folder. The only thing that actually makes a page private is moving it to a
   folder the others cannot open -- so that is the question this asks, rather
   than offering a checkbox that would be a lie. */
function makePrivatePrompt(path) {
  const title = pageTitle(path);
  const others = Spaces.list.filter(sp => sp.name !== Spaces.active);
  const body = el("div", {},
    el("div", {class: "field"},
      el("div", {style: "font-size:13.5px"},
        "\u201C" + title + "\u201D is in " + Spaces.active + ", and everybody who can open " +
        "that folder can read it. Making it private means putting it somewhere they cannot, " +
        "so pick where it should live."),
      el("div", {style: "color:var(--fg3);font-size:12px;margin-top:6px"},
        "The page moves with its tasks and its notes. Links from pages left behind will " +
        "point at nothing - that is the cost of taking it out.")));

  const list = el("div", {});
  for (const sp of others) {
    list.append(el("button", {class: "pick", onclick: () => { closeModal(); movePageToSpace(path, sp.name); }},
      el("span", {class: "k", style: "background:" + sp.color + ";color:#06101f"}, sp.name[0].toUpperCase()),
      el("span", {style: "flex:1"}, sp.name),
      el("span", {class: "d"}, sp.kind === "fs" ? (sp.label || "folder")
                             : sp.kind === "http" ? "server" : "this browser")));
  }
  list.append(el("button", {class: "pick", onclick: () => { closeModal(); newSpacePrompt(sp => movePageToSpace(path, sp.name)); }},
    el("span", {class: "k"}, "+"),
    el("span", {style: "flex:1"}, "A new private area"),
    el("span", {class: "d"}, "its own folder")));
  body.append(el("div", {class: "field"}, el("label", {}, "Move it to"), list));

  modal({center: true, title: "Make \u201C" + title + "\u201D private", body,
         foot: [el("button", {class: "btn ghost", onclick: closeModal}, "Leave it here")]});
}
