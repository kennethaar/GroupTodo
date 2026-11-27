/* Everybody in the area, led by whoever shares a first or last name with
   `near` (Tomas Lange -> Tomas Larson), then alphabetically. Typing filters
   the list; anybody not in it yet is a name typed into "someone else...".
   The choice names the person on the line. Change person and + who use it. */
function openPersonPick({path, block, space, title, near = ""}, anchor) {
  const btn = (label, run) => el("button", {class: "btn ghost", style: "display:block;width:100%;text-align:left;margin-top:4px",
    onclick: run}, label);
  const parts = trim(near).split(/\s+/), first = parts[0], last = parts[parts.length - 1];
  const shares = n => { const p = n.split(/\s+/); return !!near && (p[0] === first || p[p.length - 1] === last); };
  const others = inSpace(space, () => allPeople().map(personName))
    .filter(n => n && !(near && samePerson(n, near)) && !samePerson(n, whoAmI()))
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
  const m = modal({
    title, center: true,
    body: el("div", {class: "whenpop"},
      filterIn, list,
      btn("someone else…", () => { closeModal(); inSpace(space, () => openAssignOther(path, block)); })),
  });
  if (anchor) anchorModal(m.root, anchor);
  setTimeout(() => filterIn.focus(), 30);
}
