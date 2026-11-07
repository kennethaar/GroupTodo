/* Your own: a name for it, and a folder of your own if you want one. The
   folder is said to be yours here, and sharing it is left for later. */
function openOnboardOwn() {
  const who = onboardNameField();
  const sp0 = Spaces.get(Spaces.active) || {};
  const areaInput = el("input", {value: sp0.name || "", maxlength: "40", placeholder: "Home, Work, Family…"});
  const whereLine = el("div", {style: "color:var(--fg3);font-size:12px;margin-top:6px;line-height:1.5"});
  const whereBtn = el("button", {class: "btn ghost sm"});
  const drawWhere = () => {
    const sp = Spaces.get(Spaces.active) || {};
    const placed = sp.kind === "fs";
    whereBtn.textContent = placed ? "Change folder" : "Choose folder";
    whereBtn.className = placed ? "btn ghost sm" : "btn sm";
    // A folder that carries a name, or turned out to be somebody's area, named it.
    if (sp.joined || sp.nameFrom) areaInput.value = sp.name;
    whereLine.textContent = placed
      ? (sp.joined
          ? "“" + (sp.label || sp.name) + "” already holds somebody's list, so you are joining it rather than starting one."
          : "Writing into “" + (sp.label || sp.name) + "”. Invite people later from the area menu, top right.")
      : CAP.dirPicker
        ? "A folder of your own - on OneDrive, Dropbox or a network drive if you want it on every computer. " +
          "Your browser will ask “where this site can save changes”: that is this folder. " +
          "Skip it and the list stays in this browser."
        : "This browser cannot open folders, so it keeps the list. On a computer you can pick one.";
  };
  whereBtn.onclick = async () => {
    who.keep();
    if (!CAP.dirPicker) { notify("This browser cannot open folders.", "warn"); return; }
    await assignSpaceFolder(Spaces.active, {join: true});
    drawWhere();
  };
  drawWhere();
  /* The name given here is chosen, so it is also written into the folder,
     where the people invited later read it. Left as it was, it stays this
     browser's word for the area and nobody else's. */
  const nameArea = async () => {
    const sp = Spaces.get(Spaces.active);
    const want = trim(areaInput.value);
    if (!sp || sp.joined || !want || want === sp.name) return;
    const renamed = await Spaces.rename(sp.name, want);
    if (renamed) { renamed.named = true; await Spaces.save(); storeAreaName(renamed.name); }
  };
  const begin = async after => {
    who.keep();
    await nameArea();
    const here = await finishOnboarding();
    closeModal();
    go("today");
    if (after) after();
    else if (here?.joined) openJoinedSummary(here.name, () => requestAnimationFrame(() => focusCapture()));
    else requestAnimationFrame(() => focusCapture());
  };
  modal({
    center: true, title: "Start writing",
    body: el("div", {},
      who.field,
      el("div", {class: "field"},
        el("label", {}, "What to call it"),
        areaInput,
        el("div", {style: "color:var(--fg3);font-size:12px;margin-top:6px;line-height:1.5"},
          "Anybody you invite sees this name.")),
      el("div", {class: "field"},
        el("label", {}, "Where the files live"),
        whereBtn,
        whereLine),
      /* The app cannot open the importer for them -- it is a separate file -- so
         this only says where it is. */
      el("div", {class: "field", style: "color:var(--fg3);font-size:12px;line-height:1.5"},
        "Coming from Obsidian or Logseq? Open GroupToDo-Importer.html, next to this file " +
        "on GitHub. It copies your vault into a new folder to choose above.")),
    foot: [
      el("button", {class: "btn ghost", onclick: () => { who.keep(); closeModal(); openOnboarding(); }}, "Back"),
      el("button", {class: "btn ghost", onclick: () => begin(() => openSpacesWizard())}, "Set up several areas"),
      el("div", {style: "flex:1"}),
      el("button", {class: "btn primary", onclick: () => begin()}, "Start"),
    ],
    // The boxes hold the focus, so plain keys belong to them; Enter is how a
    // browser's own autocomplete suggestion is accepted, so it starts nothing.
    onClose: who.keep,
  });
  setTimeout(() => who.input.focus(), 30);
}
