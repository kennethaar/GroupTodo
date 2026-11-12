/* The who pill names someone with the task; it does not have to choose
   between opening the task, asking them, reading in their reply, taking it
   back or handing it to somebody else, so it offers all five. */
function openWhoMenu(a, anchor) {
  const {name, path, block, space} = a;
  const btn = (label, run) => el("button", {class: "btn ghost", style: "display:block;width:100%;text-align:left;margin-top:4px",
    onclick: run}, label);
  /* Everybody in the area, not just who can be handed a chore -- led by
     whoever shares a first or last name with the one it is leaving (Tomas
     Lange -> Tomas Larson), then alphabetically. Typing filters the list;
     anybody not in it yet is a name typed into "someone else...". */
  const openChangePerson = () => {
    const parts = trim(name).split(/\s+/), first = parts[0], last = parts[parts.length - 1];
    const shares = n => { const p = n.split(/\s+/); return p[0] === first || p[p.length - 1] === last; };
    const others = inSpace(space, () => allPeople().map(personName))
      .filter(n => n && !samePerson(n, name) && !samePerson(n, whoAmI()))
      .sort((a, b) => a.localeCompare(b));
    const ranked = others.filter(shares).concat(others.filter(n => !shares(n)));
    const filterIn = el("input", {placeholder: "Filter people", autocomplete: "off"});
    const list = el("div", {style: "max-height:240px;overflow:auto"});
    const draw = () => {
      const q = trim(filterIn.value).toLocaleLowerCase();
      list.replaceChildren(...ranked.filter(n => !q || n.toLocaleLowerCase().includes(q))
        .map(n => btn(n, () => { closeModal(); inSpace(space, () => assignBlock(path, block, n)); })));
    };
    filterIn.addEventListener("input", draw);
    draw();
    const m2 = modal({
      title: "Change person", center: true,
      body: el("div", {class: "whenpop"},
        filterIn, list,
        btn("someone else…", () => { closeModal(); inSpace(space, () => openAssignOther(path, block)); })),
    });
    anchorModal(m2.root, anchor);
    setTimeout(() => filterIn.focus(), 30);
  };
  const m = modal({
    title: name, center: true,
    body: el("div", {class: "whenpop"},
      btn("Open task", () => { closeModal(); inSpace(space, () => openTaskDetail(path, block, space)); }),
      btn("Ask for an update", () => { closeModal(); openAskForUpdate(name, block); }),
      // Their answer comes back to where you wait for it (#370).
      btn("Paste a reply", () => { closeModal(); importUpdatePasted(); }),
      btn("Take it back", () => { closeModal(); inSpace(space, () => assignBlock(path, block, "")); }),
      btn("Change person", openChangePerson)),
  });
  anchorModal(m.root, anchor);
}
