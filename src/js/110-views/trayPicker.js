/* The picker on the left: every name, searchable, grouped, one per line so a
   hundred of them stay readable. Click picks one up; dragging works as before. */
function trayPicker(kind, hint, groups, placeholder) {
  const list = el("div", {class: "plist"});
  const chips = [];
  for (const [head, items] of groups) {
    if (!items.length) continue;
    const gh = head ? el("div", {class: "gh"}, head) : null;
    if (gh) list.append(gh);
    const mine = [];
    for (const it of items) {
      const chip = trayChip(kind, it.name, it.face);
      chip.lastElementChild.className = "pn";
      chip.title = it.name + " - drag it, or click it and then click where it goes";
      if (it.sub) chip.append(el("span", {class: "ps"}, it.sub));
      if (TRAY_ARMED && TRAY_ARMED.kind === kind && TRAY_ARMED.name === it.name) chip.classList.add("armed");
      chip.addEventListener("click", () => {
        const on = !(TRAY_ARMED && TRAY_ARMED.kind === kind && TRAY_ARMED.name === it.name);
        TRAY_ARMED = on ? {kind, name: it.name} : null;
        document.querySelectorAll(".pchip.armed").forEach(x => x.classList.remove("armed"));
        if (on) chip.classList.add("armed");
        document.body.classList.toggle("armed-on", on);
      });
      // A person and an organisation dropped on each other: they work there.
      if (kind === "person") trayTarget(chip, d => d.kind === "org", d => linkPersonToOrg(it.name, d.name));
      if (kind === "org") trayTarget(chip, d => d.kind === "person", d => linkPersonToOrg(d.name, it.name));
      chip.dataset.q = it.name.toLowerCase();
      list.append(chip); mine.push(chip); chips.push(chip);
    }
    if (gh) gh._chips = mine;
  }
  const search = el("input", {type: "search", placeholder, "aria-label": placeholder});
  search.addEventListener("input", () => {
    const q = search.value.trim().toLowerCase();
    for (const ch of chips) ch.style.display = !q || ch.dataset.q.includes(q) ? "" : "none";
    list.querySelectorAll(".gh").forEach(gh => gh.style.display = gh._chips.some(ch => ch.style.display !== "none") ? "" : "none");
  });
  document.body.classList.toggle("armed-on", !!TRAY_ARMED);
  return el("aside", {class: "picker"}, el("div", {class: "say"}, hint), search, list);
}
