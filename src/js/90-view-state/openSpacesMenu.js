function openSpacesMenu() {
  const box = $("#spop");
  const shown = new Set(visibleSpaces());
  box.textContent = "";
  if (sendInAreaMenu()) box.append(el("button", {class: "spsend" + (unsentEdits() ? " dot" : ""),
    onclick: () => { closeSpacesMenu(); sendFromPhone(); }},
    "\u21E7 Send the vault file",
    el("small", {}, unsentEdits() ? "You have changes the vault file has not carried yet" : "Everything is sent")));
  // On a phone the view's ⤓ waits here too, so its heading is the title and List ▾.
  const csv = PHONE.matches && $("#content .vhead .csvbtn");
  if (csv) box.append(el("button", {class: "spsend spcsv", onclick: () => { closeSpacesMenu(); csv.click(); }},
    "\u2913 " + csv.getAttribute("aria-label"), el("small", {}, "A CSV file, which Excel opens")));
  box.append(el("h4", {}, "Show these areas"));
  for (const sp of Spaces.list) {
    const on = shown.has(sp.name), color = spaceColor(sp.name);
    const tick = el("input", {type: "checkbox", "aria-label": "Show " + sp.name});
    tick.checked = on;
    tick.addEventListener("change", async () => {
      const next = new Set(visibleSpaces());
      if (tick.checked) next.add(sp.name);
      else if (next.size === 1) { tick.checked = true; notify("At least one area has to stay on."); return; }
      else next.delete(sp.name);
      setVisibleSpaces(Array.from(next));
      await ensureVisibleLoaded();
      // Hiding the space new things land in hands that job to one still showing.
      if (!next.has(Spaces.active)) await openSpace(Array.from(next)[0]);
      render(); openSpacesMenu();
    });
    const meta = el("small", {}, sp.kind === "fs" ? (sp.label || "folder") : sp.kind === "http" ? "server" : "this browser");
    const row = el("div", {class: "sprow", title: "Drag to change the order areas sit in, top here is left on screen"},
      el("button", {class: "sq", title: "Colour for " + sp.name,
        style: "background:" + color + ";color:" + inkOn(color),
        onclick: () => { closeSpacesMenu(); openSpaceColor(sp.name); }}, sp.name[0].toUpperCase()),
      el("button", {class: "nm", title: sp.name === Spaces.active ? "New things land here" : "Make new things land here",
        onclick: async () => { closeSpacesMenu(); if (sp.name !== Spaces.active) await openSpace(sp.name); }},
        el("span", {}, sp.name, sp.name === Spaces.active ? el("span", {class: "cur"}, "  · new things land here") : null),
        meta),
      tick);
    box.append(areaDraggable(row, sp.name, openSpacesMenu));
    Spaces.summary(sp.name).then(sm => {
      if (sm) meta.textContent += " · " + sm.open + " open" + (sm.late ? " · " + sm.late + " late" : "");
    });
  }
  box.append(el("div", {class: "foot"},
    el("button", {class: "btn sm ghost", onclick: () => { closeSpacesMenu(); newSpacePrompt(); }}, "+ New area"),
    el("button", {class: "btn sm ghost", onclick: () => { closeSpacesMenu(); openSpaceStorageSetup(); }}, "Manage areas"),
    el("button", {class: "btn sm ghost", onclick: () => { closeSpacesMenu(); openShareSpaceInvite(); }}, "Invite somebody")));
  box.hidden = false;
  $("#spacesBtn").setAttribute("aria-expanded", "true");
}
