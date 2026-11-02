function viewHorizons(){
  if (!HORIZON_SINGLE_SPACE) {
    const one = state.horizonArea;
    return one && Spaces.get(one) && LOADED.has(one) ? horizonsOfArea(one) : horizonsLadder();
  }
  const c = el("div", {class: "wrap"});

  const areas = areaList(), goals = goalList();
  /* Only what this area actually runs counts as empty, or an area with no
     purpose by design would sit under the hero for ever. */
  const texts = ["vision", "purpose"].filter(horizonActive);
  const nothing = !areas.length && !goals.length && !texts.some(k => getHorizon(k).length);

  if (nothing) {
    c.append(el("div", {class: "hero"},
      el("h2", {}, "Horizons"),
      el("div", {style: "font-size:16px;font-weight:600;margin-bottom:2px"}, "Altitude, not just a list"),
      el("p", {}, (texts.length ? "Purpose, vision, goals and responsibilities are" : "Goals and responsibilities are") +
                  " what make your projects mean something. " +
                  "Nothing is created for you - the wizard asks, you answer."),
      el("div", {class: "acts"},
        el("button", {class: "btn primary", onclick: () => openHorizonsWizard(0)}, "Run the setup wizard"))));
  }

  for (const row of activeHorizons()) {
    const h = horizonMeta(row.key);
    if (h.key === "purpose" || h.key === "vision") {
      const has = getHorizon(h.key).length;
      c.append(horizonRow(h, textHorizonCard(h.key, h),
        el("span", {},
          has
            ? el("button", {class: "btn sm ghost", style: "margin-right:6px",
                onclick: () => openPage(horizonPath(h.key))}, "open")
            : null,
          el("button", {class: "btn sm ghost", onclick: () => editHorizonText(h.key, h)},
            /* An inherited horizon is not yours to define - you are writing
               down something that already exists somewhere else. */
            has ? "edit" : h.inherited ? "record" : "define"))));
    } else if (h.key === "goals") {
      const card = el("div", {class: "card"});
      if (!goals.length) card.append(el("div", {class: "empty"}, h.ask));
      for (const g of goals) {
        const name = baseName(g);
        const live = projectsForGoal(name).filter(p => ["1", "3"].includes(statusDirOf(p)));
        card.append(el("div", {class: "prow"},
          el("span", {class: "st st-1"}, "3"),
          el("button", {class: "nm", style: "text-align:left", onclick: () => openPage(g)}, pageTitle(g)),
          el("button", {class: "chip b", onclick: () => openAreaPickerFor(g)},
            areaOfGoal(g) ? areaOfGoal(g) : "no responsibility"),
          live.length ? el("span", {class: "chip"}, live.length + " projects")
                      : el("span", {class: "chip miss b", onclick: () => newProjectPrompt(np => { setGoalOfProject(np, name); openPage(np); })},
                          "no project")));
      }
      c.append(horizonRow(h, card,
        el("button", {class: "btn sm ghost", onclick: () => newGoalPrompt()}, "+ goal")));
    } else if (h.key === "areas") {
      const card = el("div", {class: "card"});
      if (!areas.length) card.append(el("div", {class: "empty"}, h.ask));
      for (const a of areas) {
        const name = baseName(a);
        const projects = projectsInArea(name);
        const open = projects.reduce((n, p) => n + openTodoCount(p), 0);
        card.append(el("div", {class: "prow"},
          el("span", {class: "st st-2"}, "2"),
          el("button", {class: "nm", style: "text-align:left", onclick: () => openPage(a)}, name),
          el("span", {class: "sub"}, projects.length + " projects"),
          open ? el("span", {class: "chip"}, open + " open") : null,
          el("button", {class: "btn sm ghost", onclick: () => newProjectPrompt(np => { setAreaOfProject(np, name); openPage(np); })},
            "+ project")));
      }
      const orphans = unassignedProjects();
      if (orphans.length) {
        card.append(el("div", {class: "dash-item", style: "color:var(--warn)"},
          el("span", {}, orphans.length + " project(s) under no responsibility"),
          el("span", {class: "fix", onclick: () => openAreaPicker(orphans[0])}, "assign")));
      }
      c.append(horizonRow(Object.assign({}, h, {name: "Responsibilities in " + V.space}), card,
        el("button", {class: "btn sm ghost", onclick: () => newAreaPrompt()}, "+ responsibility")));
    } else if (h.key === "projects") {
      const card = el("div", {class: "card"});
      for (const code of STATUS_ORDER) {
        card.append(el("button", {class: "prow", onclick: () => go("projects", {statusCode: code})},
          el("span", {class: "st st-" + code}, code),
          el("span", {class: "nm"}, STATUS_LABEL[code]),
          el("span", {class: "sub"}, projectsIn(code).length + "")));
      }
      const noOutcome = projectsWithoutOutcome();
      if (noOutcome.length) {
        card.append(el("div", {class: "dash-item", style: "color:var(--warn)"},
          el("span", {}, noOutcome.length + " project(s) with no stated outcome"),
          el("span", {class: "fix", onclick: () => openOutcomePrompt(noOutcome[0])}, "define")));
      }
      c.append(horizonRow(h, card));
    } else {
      const open = openOf(leafActions());
      const card = el("div", {class: "card"},
        el("button", {class: "prow", onclick: () => go("next")},
          el("span", {class: "st st-1"}, "▸"),
          el("span", {class: "nm"}, "Open next actions"),
          el("span", {class: "sub"}, open.length + "")));
      c.append(horizonRow(h, card));
    }
  }

  // What this area's journal is for, once it says (#185).
  const aims = intentions();
  if (aims.length) c.append(el("div", {class: "section"},
    el("h3", {}, el("span", {}, "Intentions · what the journal is for"),
      el("span", {style: "margin-left:auto"}, el("button", {class: "btn sm ghost", onclick: () => openPage(INTENTIONS_PATH)}, "open"))),
    el("div", {class: "card"}, ...aims.map(t => el("div", {class: "dash-item", translate: "no", html: renderInline(t)})))));

  c.append(el("div", {class: "section"},
    el("button", {class: "btn ghost", onclick: () => openHorizonsWizard(0)}, "Run the horizons wizard")));
  return c;
}
