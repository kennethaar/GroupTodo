/* On a person's or an organisation's page: what they are a stakeholder in,
   picked there as well as on the responsibility, and how often they want to
   hear about it. What is picked here is written on the responsibility's page,
   stakeholder:: [[p/Name]], so both pages say the same. */
function stakeholderLine(to) {
  const resp = stakeIn(to);
  const add = () => {
    const areas = acrossSpaces(() => areaList().map(path => ({path, title: pageTitle(path)})))
      .map(a => Object.assign(a, {space: a.space || V.space}))
      .filter(a => !resp.some(r => r.space === a.space && r.path === a.path));
    if (!areas.length) { notify(resp.length ? to.name + " is a stakeholder in every responsibility already."
      : "No responsibilities yet. + New responsibility on Responsibilities makes one.", "warn"); return; }
    listPicker({title: to.name + " is a stakeholder in", typeahead: true, items: areas,
      label: a => a.title, detail: a => multiSpace() ? a.space : "",
      onPick: a => {
        const u = inSpace(a.space, () => addStakeholder(a.path, to));
        if (u) pushUndo({run: () => { inSpace(a.space, u); render(); return true; }});
        clearMemo();
        render();
        notify(to.name + " is a stakeholder of " + a.title + ".");
      }});
  };
  const drop = a => inSpace(a.space, () => {
    const was = structuredClone(getPage(a.path).props);
    dropStakeholder(a.path, to);
    pushUndo({run: () => { inSpace(a.space, () => { getPage(a.path).props = was; touch(a.path); }); render(); return true; }});
    clearMemo();
    render();
    notify(to.name + " is no longer a stakeholder of " + a.title + ". Ctrl-Z brings them back.");
  });
  const pills = resp.map(a => el("span", {class: "stake", title: toldWords(a.told ? dateDiffDays(a.told, todayISO()) : null)},
    el("span", {class: "wikilink", onclick: () => openPageIn(a.space, a.path)}, a.title),
    el("button", {"aria-label": "No longer a stakeholder of " + a.title, title: "No longer a stakeholder of " + a.title,
      onclick: () => drop(a)}, "×")));
  const row = el("div", {class: "t-meta stakein"}, el("span", {class: "plain"}, "Stakeholder in"), ...pills,
    el("button", {class: "textbtn", title: "Hears how the projects under it are going", onclick: add},
      resp.length ? "+ another" : "+ responsibility"));
  if (resp.length) {
    const sel = el("select", {style: "width:auto", "aria-label": "How often " + to.name + " hears", onchange: () => setUpdateEvery(to, sel.value)});
    for (const [v] of UPDATE_EVERY) sel.append(el("option", {value: v}, everyWords(v)));
    sel.value = updateEvery(to);
    row.append(el("span", {class: "plain"}, "Update"), sel);
  }
  return row;
}
