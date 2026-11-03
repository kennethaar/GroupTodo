function npmPeopleQ() {
  const mine = NPM.people;
  const all = npmIn(() => allPeople().map(personName)).filter(n => !samePerson(n, whoAmI()));
  const aliasOf = new Map(npmIn(() => allPeople().map(p => [personName(p), pageAliases(p)])));
  const calls = n => [n, ...(aliasOf.get(n) || [])].map(a => a.toLowerCase());
  const memberNames = npmIn(() => members().map(m => m.name));
  const filter = el("input", {class: "npmin", placeholder: "Find a person, or type a new name", "aria-label": "Find a person"});
  const chips = el("div", {class: "npmchips"});
  const toggle = n => { const i = mine.findIndex(x => samePerson(x, n)); if (i >= 0) mine.splice(i, 1); else mine.push(n); NPM.peopleDone = true; npmSave(); render(); };
  const draw = () => {
    const q = trim(filter.value).toLowerCase();
    const list = [...mine, ...all.filter(n => !mine.some(x => samePerson(x, n)))
      .sort((a, b) => (memberNames.includes(b) - memberNames.includes(a)) || a.localeCompare(b))]
      .filter(n => !q || calls(n).some(a => a.includes(q))).slice(0, 16);
    chips.replaceChildren(...list.map(n => fchip(n, mine.some(x => samePerson(x, n)), () => toggle(n))));
    const name = trim(filter.value);
    if (name && !all.some(n => calls(n).includes(name.toLowerCase())) && !mine.some(n => n.toLowerCase() === name.toLowerCase()))
      chips.append(el("button", {class: "fchip more", onclick: () => toggle(slugify(name))}, "+ New: " + name));
  };
  filter.addEventListener("input", draw);
  filter.addEventListener("keydown", e => {
    if (e.key !== "Enter" || e.ctrlKey || e.metaKey) return;
    e.preventDefault();
    const first = chips.querySelector("button");
    if (trim(filter.value) && first) first.click(); else npmNext();
  });
  draw();
  return [el("div", {class: "npmh"}, mine.length ? "On it: " + mine.join(", ") : "Nobody yet: just you"),
    filter, chips];
}
