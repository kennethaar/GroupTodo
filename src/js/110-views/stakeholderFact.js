/* stakeholder:: on a responsibility: one pill per person or organisation, and
   + stakeholder, which opens the same picker as the Stakeholders section. */
function stakeholderFact(path) {
  const space = V.space, props = getPage(path)?.props || {};
  const key = Object.keys(props).find(k => STAKE_PROPS.includes(k.toLowerCase())) || "stakeholder";
  const add = () => pickInformTarget(to => {
    const u = inSpace(space, () => addStakeholder(path, to));
    if (u) pushUndo({run: () => { inSpace(space, u); render(); return true; }});
    render();
    notify(to.name + " is a stakeholder of " + pageTitle(path) + ".");
  }, "Stakeholder of " + pageTitle(path));
  const drop = s => {
    const was = structuredClone(getPage(path).props);
    dropStakeholder(path, s);
    pushUndo({run: () => { inSpace(space, () => { getPage(path).props = was; touch(path); }); render(); return true; }});
    render();
    notify(s.name + " is no longer a stakeholder of " + pageTitle(path) + ". Ctrl-Z brings them back.");
  };
  return {
    key: "stakeholders", raw: key + ":: " + (props[key] || ""), own: true,
    save: text => saveRawProp(path, key, text),
    pills: () => [
      ...stakeholdersOfArea(path).map(s => factPill(s.name, "fquiet", "Hears how this responsibility is going",
        () => chipMenu(s.name, "a stakeholder of " + pageTitle(path), lettered([
          ["Go to " + s.name, null, () => s.org ? followLink("o/" + s.name) : openPersonPage(s.name)],
          ["Send an update", null, () => openSendUpdate(s)],
          ["No longer a stakeholder", "Ctrl-Z brings them back", () => drop(s)],
        ])))),
      factPill("+ stakeholder", "fwant", "Who hears how this is going: a boss, a board, a client", add),
    ],
  };
}
