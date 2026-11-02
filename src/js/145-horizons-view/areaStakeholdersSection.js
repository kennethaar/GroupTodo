/* On a responsibility's page: who wants to hear about it, when each was told,
   and the way to tell them. */
function areaStakeholdersSection(path) {
  const space = V.space, list = stakeholdersOfArea(path);
  const card = el("div", {class: "card", style: "padding:8px 14px"});
  for (const s of list) {
    const told = toldOn(path, s), days = told ? dateDiffDays(told, todayISO()) : null;
    card.append(el("div", {style: "display:flex;gap:10px;align-items:center;margin:5px 0;flex-wrap:wrap"},
      s.org ? el("span", {}, "\u{1F3E2}") : avatarNode(s.name, 22),
      el("button", {class: "textbtn", style: "font-weight:600", onclick: () => s.org ? followLink("o/" + s.name) : openPersonPage(s.name)}, s.name),
      el("span", {style: "flex:1;color:var(--fg3);font-size:12.5px"}, toldWords(days) + " · " + everyWords(updateEvery(s))),
      el("button", {class: "btn sm ghost", onclick: () => openSendUpdate(s)}, "✉ Send an update"),
      el("button", {class: "textbtn", title: "No longer a stakeholder here", onclick: () => {
        const was = structuredClone(getPage(path).props);
        dropStakeholder(path, s);
        pushUndo({run: () => { inSpace(space, () => { getPage(path).props = was; touch(path); }); render(); return true; }});
        render();
        notify(s.name + " is no longer a stakeholder of " + pageTitle(path) + ". Ctrl-Z brings them back.");
      }}, "×")));
  }
  if (!list.length) card.append(el("div", {class: "empty", style: "text-align:left"},
    "Nobody yet. A stakeholder hears how the projects under this responsibility are going: a boss, a board, a client."));
  card.append(el("div", {style: "margin-top:6px"}, el("button", {class: "btn sm ghost", onclick: () => pickInformTarget(to => {
    const u = inSpace(space, () => addStakeholder(path, to));
    if (u) pushUndo({run: () => { inSpace(space, u); render(); return true; }});
    render();
    notify(to.name + " is a stakeholder of " + pageTitle(path) + ".");
  }, "Stakeholder of " + pageTitle(path))}, "+ stakeholder")));
  return section("Stakeholders", list.length, card);
}
