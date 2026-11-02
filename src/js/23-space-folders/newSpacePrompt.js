function newSpacePrompt(then) {
  const nameInput = el("input", {placeholder: "Work"});
  let kind = CAP.dirPicker ? "fs" : "local";
  let profile = DEFAULT_HORIZON_PROFILE;
  let color = nextSpaceColor();
  const preview = colorPreview(() => nameInput.value, color);
  const picker = colorPicker(color, c => { color = c; preview.paint(c); });
  nameInput.addEventListener("input", () => preview.paint());
  const opts = [
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
        const sp = await createSpace(name, kind, color);
        if (!sp) return;
        PENDING_PROFILE.set(sp.name, profile);
        notify("Area created: " + sp.name);
        if (then) then(sp); else await openSpace(sp.name);
        renderNav();
      }}, "Create"),
    ],
  });
  setTimeout(() => nameInput.focus(), 30);
}
