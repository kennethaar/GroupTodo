function openShareSpaceInvite() {
  const sp = Spaces.get(Spaces.active) || {};
  const counts = {
    pages: V.pages.size,
    projects: allPages(p => statusDirOf(p)).length,
    actions: openOf(leafActions()).length,
  };
  const slug = (sp.name || "space").toLowerCase().replace(/[^\w-]+/g, "-");

  modal({
    center: true, title: "Invite somebody to " + (sp.name || "this area"),
    body: el("div", {},
      el("div", {class: "field"},
        el("label", {}, "What they get"),
        el("div", {style: "color:var(--fg2);font-size:13.5px"},
          "The area already set up - its name, its colour" +
          (sp.kind === "http" ? ", the server address" : "") +
          " - and everything in it: " + counts.pages + " pages, " +
          counts.projects + " projects, " + counts.actions + " open. They open it " +
          "and they are in."),
        sp.kind === "fs" ? el("div", {style: "color:var(--warn);font-size:12.5px;margin-top:8px"},
          "Share the folder \u201C" + (sp.label || sp.name) + "\u201D with them as well. A " +
          "browser will not let a folder travel in a file, so they press one button to " +
          "point at it - the invite tells them which folder to look for.") : null),
      el("div", {class: "field"},
        el("label", {}, "Send them"),
        el("div", {style: "display:flex;gap:8px;flex-wrap:wrap"},
          el("button", {class: "btn primary", onclick: async () => {
            const name = "join-" + slug + ".md";
            closeModal();
            const how = await sendMarkdownOut(name, inviteMarkdown(),
              {title: "Join " + sp.name + " in GroupToDo"});
            notify((how === "shared" ? "Sent " : "Saved ") + name +
                   ". They open it with \u201COpen one I was sent\u201D.");
          }}, "Invite file"),
          CAP.served ? el("button", {class: "btn ghost", onclick: async () => {
            closeModal();
            try {
              const html = await bakeInviteHtml();
              downloadText("GroupToDo-" + slug + ".html", html);
              notify("Saved one file with the app and the area in it. They just open it.");
            } catch (e) {
              notify("Could not build that here: " + e.message + " Send the invite file instead.", "warn");
            }
          }}, "One file: app + area") : null),
        el("div", {style: "color:var(--fg3);font-size:12px;margin-top:8px"},
          CAP.served
            ? "The invite file needs grouptodo.html at the other end. The single file needs nothing."
            : "Send grouptodo.html alongside it. Open the app from a web address and it can " +
              "bake both into one file instead."),
        el("div", {style: "color:var(--fg3);font-size:12px;margin-top:6px"},
          "A copy, not a permission. Once they have it they keep it, and nothing here can " +
          "take it back.")),
      el("div", {class: "field"},
        el("label", {}, "Careful"),
        el("div", {style: "color:var(--fg3);font-size:12.5px"},
          "Your other areas are different folders and different files. None of them is " +
          "in here."))),
    foot: [el("button", {class: "btn ghost", onclick: closeModal}, "Close")],
  });
}
