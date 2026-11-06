function openExportPage(rootPath) {
  if (!V.pages.has(rootPath)) { notify("That page is not in this area.", "error"); return; }
  const opts = {includeRefs: false, strip: false, fenced: true, html: false};
  const canHtml = !isJournalPath(rootPath) && pageKind(rootPath) === "project";
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
    const bytes = (opts.html ? handoverSheetHtml(rootPath, opts) : exportMarkdown(paths, opts)).length;
    summary.textContent = paths.length + (paths.length === 1 ? " page, " : " pages, ") +
      (bytes < 1024 ? bytes + " bytes" : Math.round(bytes / 1024) + " KB") +
      (opts.strip ? ", attribution removed" : "");
  };

  const toggle = (key, label, hint) => {
    const box = el("button", {class: "spacetoggle" + (opts[key] ? " on" : ""),
      onclick: () => { opts[key] = !opts[key]; box.classList.toggle("on", opts[key]); refresh(); }},
      opts[key] ? svgIcon(ICON_CHECK) : null);
    return el("div", {style: "display:flex;gap:10px;align-items:flex-start;margin:6px 0"},
      box, el("div", {}, el("div", {}, label),
        el("div", {style: "color:var(--fg3);font-size:12px"}, hint)));
  };

  const shapes = el("div", {class: "seg"});
  const hint = el("div", {style: "color:var(--fg3);font-size:12px;margin-top:6px"});
  const shapeHint = () => hint.textContent = opts.html
    ? "One file anyone can open in a browser, print or save as PDF. Day-page lines that link here are in it. Does not merge back."
    : opts.fenced
      ? "They open it with Vault & sync → Open vault file, and it merges into their vault."
      : "Readable in any editor. Does not merge back.";
  const shapeList = [["gtd", "GroupToDo file"], ["md", "Plain markdown"], ...(canHtml ? [["html", "Readable page (HTML)"]] : [])];
  for (const [k, label] of shapeList) {
    const btn = el("button", {class: k === "gtd" ? "on" : "", onclick: () => {
      opts.fenced = k === "gtd"; opts.html = k === "html";
      for (const x of shapes.children) x.classList.toggle("on", x.dataset.k === k);
      shapeHint(); refresh();
    }}, label);
    btn.dataset.k = k;
    shapes.append(btn);
  }
  shapeHint();

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
        el("label", {}, "Shape"), shapes, hint),
      el("div", {class: "field"},
        el("div", {style: "color:var(--fg3);font-size:12.5px"},
          "A copy, not a permission. Once they have the file they keep it, and GroupToDo " +
          "cannot take it back or expire it."))),
    foot: [
      el("button", {class: "btn ghost", onclick: closeModal}, "Cancel"),
      el("button", {class: "btn primary", onclick: () => {
        const paths = collectExport(rootPath, opts);
        const text = opts.html ? handoverSheetHtml(rootPath, opts) : exportMarkdown(paths, opts);
        const name = "grouptodo-project-" +
          baseName(rootPath).toLowerCase().replace(/[^\w-]+/g, "-") + (opts.html ? ".html" : ".md");
        closeModal();
        (opts.html ? sendFileOut(name, text, "text/html", {title: pageTitle(rootPath)})
                   : sendMarkdownOut(name, text, {title: pageTitle(rootPath)})).then(how => {
          notify((how === "shared" ? "Sent " : "Exported ") + paths.length +
                 " page" + (paths.length === 1 ? "" : "s") + " as " + name + ".");
        });
      }}, "Export"),
    ],
  });
}
