function openExportPage(rootPath) {
  if (!V.pages.has(rootPath)) { notify("That page is not in this area.", "error"); return; }
  const opts = {includeRefs: false, strip: false, fenced: true};
  const manifest = el("div", {});
  const summary = el("div", {style: "color:var(--fg3);font-size:12px;margin-top:8px"});

  const refresh = () => {
    const paths = collectExport(rootPath, opts);
    manifest.textContent = "";
    for (const p of paths) {
      const blocks = flattenBlocks(getPage(p).blocks).length;
      manifest.append(el("div", {class: "dash-item", style: "cursor:default"},
        el("span", {}, pageTitle(p)),
        el("span", {class: "p"}, p),
        el("span", {class: "chip"}, blocks + (blocks === 1 ? " block" : " blocks"))));
    }
    const bytes = exportMarkdown(paths, opts).length;
    summary.textContent = paths.length + (paths.length === 1 ? " page, " : " pages, ") +
      (bytes < 1024 ? bytes + " bytes" : Math.round(bytes / 1024) + " KB") +
      (opts.strip ? ", attribution removed" : "");
  };

  const toggle = (key, label, hint) => {
    const box = el("button", {class: "spacetoggle" + (opts[key] ? " on" : ""),
      onclick: () => { opts[key] = !opts[key]; box.classList.toggle("on", opts[key]); refresh(); }},
      opts[key] ? "✓" : "");
    return el("div", {style: "display:flex;gap:10px;align-items:flex-start;margin:6px 0"},
      box, el("div", {}, el("div", {}, label),
        el("div", {style: "color:var(--fg3);font-size:12px"}, hint)));
  };

  const shapes = el("div", {class: "seg"});
  for (const [k, label] of [[true, "GroupToDo file"], [false, "Plain markdown"]]) {
    const btn = el("button", {class: k === opts.fenced ? "on" : "", onclick: () => {
      opts.fenced = k;
      for (const x of shapes.children) x.classList.toggle("on", (x.dataset.k === "1") === k);
      refresh();
    }}, label);
    btn.dataset.k = k ? "1" : "0";
    shapes.append(btn);
  }

  refresh();

  modal({
    center: true, title: "Share " + pageTitle(rootPath),
    body: el("div", {},
      el("div", {class: "field"},
        el("label", {}, "What goes in the file"),
        manifest, summary),
      el("div", {class: "field"},
        el("label", {}, "Include"),
        toggle("includeRefs", "Pages this one links to",
               "its context, responsibility, goal and source template. Journals are never included."),
        toggle("strip", "Remove who did what",
               "drops by::, done_by:: and updated_by:: from the copy you send.")),
      el("div", {class: "field"},
        el("label", {}, "Shape"), shapes,
        el("div", {style: "color:var(--fg3);font-size:12px;margin-top:6px"},
          opts.fenced
            ? "They open it with Vault & sync → Open vault file, and it merges into their vault."
            : "Readable in any editor. Does not merge back.")),
      el("div", {class: "field"},
        el("div", {style: "color:var(--fg3);font-size:12.5px"},
          "A copy, not a permission. Once they have the file they keep it, and GroupToDo " +
          "cannot take it back or expire it."))),
    foot: [
      el("button", {class: "btn ghost", onclick: closeModal}, "Cancel"),
      el("button", {class: "btn primary", onclick: () => {
        const paths = collectExport(rootPath, opts);
        const text = exportMarkdown(paths, opts);
        const name = "grouptodo-project-" +
          baseName(rootPath).toLowerCase().replace(/[^\w-]+/g, "-") + ".md";
        closeModal();
        sendMarkdownOut(name, text, {title: pageTitle(rootPath)}).then(how => {
          notify((how === "shared" ? "Sent " : "Exported ") + paths.length +
                 " page" + (paths.length === 1 ? "" : "s") + " as " + name + ".");
        });
      }}, "Export"),
    ],
  });
}
