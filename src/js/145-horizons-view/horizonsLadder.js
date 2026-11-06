function horizonsLadder() {
  const c = el("div", {class: "wrap"});
  c.append(vhead("Horizons", "What it is all for, the areas you keep, and the work in them"));
  const home = homeArea();
  const homeOpen = home && LOADED.has(home);

  if (homeOpen) inSpace(home, () => {
    for (const key of ["purpose", "vision"]) {
      if (!horizonActive(key)) continue;
      const h = horizonMeta(key);
      c.append(horizonRow(h, textHorizonCard(key, h),
        el("button", {class: "btn sm ghost", title: "Kept in " + home,
          onclick: () => openAreaHorizons(home)}, getHorizon(key).length ? "edit" : "define")));
    }
  });

  const gh = horizonMeta("goals");
  const goals = Spaces.list.map(sp => sp.name).filter(n => LOADED.has(n)).flatMap(n => inSpace(n, () =>
    horizonActive("goals") ? goalList().map(g => ({space: n, path: g, title: pageTitle(g), resp: areaOfGoal(g)})) : []));
  const gcard = el("div", {class: "card"});
  if (!goals.length) gcard.append(el("div", {class: "empty"}, gh.ask));
  for (const g of goals) gcard.append(el("div", {class: "prow"},
    el("span", {class: "st st-1"}, "3"),
    el("button", {class: "nm", style: "text-align:left", onclick: () => openPageIn(g.space, g.path)}, g.title),
    g.resp ? el("span", {class: "chip"}, g.resp) : null,
    spaceBadge(g.space)));
  c.append(horizonRow(gh, gcard,
    el("button", {class: "btn sm ghost", onclick: () => openAreaHorizons(Spaces.active)}, "+ goal")));

  const ah = Object.assign({}, horizonMeta("areas"), {name: "Areas"});
  const acard = el("div", {class: "card"});
  for (const sp of Spaces.list) {
    const s = areaSummary(sp.name);
    const row = el("div", {class: "arow"},
      el("div", {class: "arow-top"},
        s && s.face ? s.face : el("span", {class: "arow-dot", style: "background:" + spaceColor(sp.name)}),
        el("button", {class: "nm", onclick: () => openAreaHorizons(sp.name)}, sp.name),
        s ? null : el("span", {class: "sub"}, "opening..."),
        s ? el("span", {class: "chip"}, s.active + (s.active === 1 ? " active project" : " active projects")) : null,
        s && s.waiting ? el("span", {class: "chip"}, s.waiting + " waiting") : null,
        el("button", {class: "btn sm ghost", style: "margin-left:auto", onclick: () => openAreaHorizons(sp.name)}, "Horizons ›")));
    if (s) {
      const chips = el("div", {class: "arow-resp"});
      if (!s.resp.length) chips.append(el("span", {class: "sub"}, "No responsibilities written down yet"));
      for (const r of s.resp.slice(0, 12))
        chips.append(el("button", {class: "chip b", onclick: () => openPageIn(sp.name, r.path)}, r.title));
      if (s.resp.length > 12) chips.append(el("button", {class: "textbtn", onclick: () => openAreaHorizons(sp.name)},
        "+" + (s.resp.length - 12) + " more"));
      row.append(chips);
    }
    acard.append(row);
  }
  c.append(horizonRow(ah, acard,
    el("button", {class: "btn sm ghost", onclick: () => newSpacePrompt()}, "+ New area")));

  const ph = horizonMeta("projects");
  const pcard = el("div", {class: "card"});
  for (const code of STATUS_ORDER) {
    pcard.append(el("button", {class: "prow", onclick: () => go("projects", {statusCode: code})},
      el("span", {class: "st st-" + code}, code),
      el("span", {class: "nm"}, STATUS_LABEL[code]),
      el("span", {class: "sub"}, visibleProjects(code).length + "")));
  }
  c.append(horizonRow(ph, pcard));
  const gr = horizonMeta("ground");
  c.append(horizonRow(gr, el("div", {class: "card"},
    el("button", {class: "prow", onclick: () => go("next")},
      el("span", {class: "st st-1"}, svgIcon(ICON_CHEVRON_RIGHT)),
      el("span", {class: "nm"}, "Your next actions"),
      el("span", {class: "sub"}, myOpen().length + "")))));
  c.append(el("p", {class: "hint"}, multiSpace()
    ? "Projects and next actions count the areas you are showing."
    : "Projects and next actions count " + (Spaces.active || "this area") + "."));
  return c;
}
