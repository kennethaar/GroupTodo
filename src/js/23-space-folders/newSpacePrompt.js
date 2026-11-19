/* Where a new area is stored is asked here, so serve.py's free folders belong
   in the choice (#432): the browser's own picker is the one place that can
   fail -- a company blocks it on OneDrive (#419) -- and without this the only
   way into a second server folder was to make the area in the browser and
   find Use server folder on its card afterwards. */
function newSpacePrompt(then) {
  const nameInput = el("input", {placeholder: "Work"});
  const free = serverFolderOptions().filter(o => !o.users.length);
  let kind = free.length ? "server" : CAP.dirPicker ? "fs" : "local";
  let profile = DEFAULT_HORIZON_PROFILE;
  let color = nextSpaceColor();
  const preview = colorPreview(() => nameInput.value, color);
  const picker = colorPicker(color, c => { color = c; preview.paint(c); });
  nameInput.addEventListener("input", () => preview.paint());
  const opts = [
    free.length ? ["server", "Server folder", free.length === 1
      ? "“" + free[0].name + "” on this PC" + serverFilesNote(free[0]) + ". Phones reach it too."
      : free.length + " free folders on this PC. You pick which."] : null,
    CAP.dirPicker ? ["fs", "Own folder", "Share the folder to share the area."] : null,
    ["local", "This browser", "Share it later as one .md file."],
  ].filter(Boolean);
  const where = segPicker(opts.map(([k, label, why]) => ({key: k, label, blurb: why})),
    kind, k => { kind = k; });

  /* What the space is for. It decides which altitudes this vault runs and how
     they are worded -- a job is not asked why it is here. Changeable later in
     Vault & sync, and it only changes what is shown, never what is stored. */
  const purpose = segPicker(Object.values(HORIZON_PROFILES), profile, k => { profile = k; });

  modal({
    center: true, title: "New area",
    body: el("div", {},
      el("div", {class: "field"},
        el("label", {}, "Name"),
        nameInput,
        el("div", {style: "color:var(--fg3);font-size:12px;margin-top:6px"},
          "Its own vault. Nothing leaks between areas.")),
      el("div", {class: "field"}, el("label", {}, "For"), purpose),
      el("div", {class: "field"}, el("label", {}, "Stored in"), where),
      el("div", {class: "field"},
        el("label", {}, "Colour"),
        picker,
        preview.node)),
    foot: [
      el("button", {class: "btn ghost", onclick: closeModal}, "Cancel"),
      el("button", {class: "btn primary", onclick: async () => {
        const name = trim(nameInput.value);
        if (!name) return;
        closeModal();
        const sp = await createSpace(name, kind === "server" ? "local" : kind, color);
        if (!sp) return;
        PENDING_PROFILE.set(sp.name, profile);
        notify("Area created: " + sp.name);
        /* The area is made first and moved in after, as a card does it: the
           server says what it holds, and a server that has gone quiet leaves
           the area in the browser rather than nothing at all. */
        if (kind === "server") {
          const o = free.length === 1 ? free[0] : await pickServerFolder(sp.name, free);
          if (o) await useServerFolder(sp.name, o.base);
        }
        if (then) then(sp); else await openSpace(sp.name);
        renderNav();
      }}, "Create"),
    ],
  });
  setTimeout(() => nameInput.focus(), 30);
}
