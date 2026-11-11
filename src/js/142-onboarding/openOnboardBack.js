/* Used it before. Each web address keeps its own browser storage, so moving
   from the file on disk to GitHub Pages or serve.py, or to a new computer,
   opens empty -- though the folders are where they were. Each folder picked
   here comes back as one area, named what the folder says it is called, with
   nothing of the starter set added. The first goes into the area the app made
   on its own; each one after gets an area of its own. */
function openOnboardBack() {
  const who = onboardNameField();
  const listBox = el("div", {style: "display:flex;flex-direction:column;gap:6px;margin:4px 0 10px"});
  const placed = () => Spaces.list.filter(sp => sp.kind === "fs" || sp.kind === "http");
  const addBtn = el("button", {class: "btn primary"});
  // serve.py's folder, offered beside your own while no area lives there (#356).
  const serverBtn = el("button", {class: "btn ghost"}, "Use server folder");
  const draw = () => {
    listBox.textContent = "";
    for (const sp of placed()) listBox.append(el("div", {style: "display:flex;gap:8px;align-items:center"},
      spaceBadge(sp.name, true),
      el("span", {style: "color:var(--fg2);font-size:13px"},
        sp.kind === "http" ? "in the server folder" : "“" + (sp.label || "folder") + "”")));
    addBtn.textContent = placed().length ? "Add another folder" : "Choose a folder";
    if (serverFolderUsers().length) serverBtn.remove();      // one area per folder
  };
  /* The area the app made on its own takes the first folder; each one after
     gets an area of its own, taken away again if nothing came of it. */
  const bring = async put => {
    who.keep();
    let sp = Spaces.get(Spaces.active);
    let made = null;
    if (!sp || !sp.placeholder || sp.kind !== "local") {
      let n = Spaces.list.length + 1;
      while (Spaces.get("Area " + n)) n++;
      made = await createSpace("Area " + n, "local");
      if (!made) return;
      made.placeholder = true; await Spaces.save();
      sp = made;
    }
    const got = await put(sp.name);
    if (!got && made) await Spaces.remove(made.name);
    draw();
  };
  addBtn.onclick = () => bring(name => assignSpaceFolder(name, {join: true, returning: true}));
  serverBtn.onclick = () => bring(name => useServerFolder(name));
  const enter = async () => {
    who.keep();
    const here = await finishOnboarding({returning: true});
    // Every area brought back is shown, as it would have been where it came from.
    const back = placed().map(sp => sp.name);
    if (back.length) { setVisibleSpaces(back); if (!back.includes(Spaces.active)) await openSpace(back[0]); await ensureVisibleLoaded(); }
    closeModal();
    go("today");
    render();
    requestAnimationFrame(() => focusCapture());
    return here;
  };
  draw();
  modal({
    center: true, title: "Pick up where you left off",
    body: el("div", {},
      who.field,
      el("div", {class: "field"},
        el("label", {}, "Your folders"),
        el("div", {style: "color:var(--fg3);font-size:12.5px;line-height:1.5;margin-bottom:8px"},
          "Each web address keeps its own copy in the browser, so a new one starts empty. " +
          "Your files are still in their folders. Pick each area's folder, one at a time."),
        listBox,
        CAP.dirPicker ? el("div", {style: "display:flex;gap:8px;flex-wrap:wrap"}, addBtn, SERVER_BASE ? serverBtn : null)
          : el("div", {style: "color:var(--fg3);font-size:12.5px"},
          "This browser cannot open folders. Open a vault file instead, from Vault & sync, " +
          "or use Chrome or Edge on a computer."))),
    foot: [
      el("button", {class: "btn ghost", onclick: () => { who.keep(); closeModal(); openOnboarding(); }}, "Back"),
      el("div", {style: "flex:1"}),
      el("button", {class: "btn primary", onclick: () => enter()}, "Start"),
    ],
    onClose: who.keep,
  });
  setTimeout(() => who.input.focus(), 30);
}
