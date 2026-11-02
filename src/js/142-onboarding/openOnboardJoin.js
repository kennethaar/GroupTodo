/* Invited: the folder is theirs before it is yours. It is opened as it is,
   named by what it says it is called, and nothing of the starter set goes in. */
function openOnboardJoin() {
  const who = onboardNameField();
  const enter = async () => {
    who.keep();                        // again, now in their folder: your member page goes in with you
    const here = await finishOnboarding();
    closeModal();
    go("today");
    openJoinedSummary(here.name, () => requestAnimationFrame(() => focusCapture()));
  };
  modal({
    center: true, title: "Join an area you were invited to",
    body: el("div", {},
      who.field,
      el("div", {class: "field", style: "margin-bottom:4px"},
        el("label", {}, "What were you sent?")),
      CAP.dirPicker ? el("button", {class: "pick", onclick: async () => {
        who.keep();                    // the folder picker needs a gesture; keep what is typed
        if (await assignSpaceFolder(Spaces.active, {join: true, invited: true})) await enter();
      }},
        el("span", {class: "k"}, "1"),
        el("span", {}, el("b", {}, "A shared folder"), el("br"),
          el("span", {style: "color:var(--fg3);font-size:12.5px"},
            "From OneDrive, Dropbox or a network drive. Your browser will ask “where this " +
            "site can save changes”: pick the folder they shared with you."))) : null,
      el("button", {class: "pick", onclick: async () => {
        who.keep();
        const here = await finishOnboarding();
        closeModal();
        /* An invite file takes its own road from here. A plain vault file is a
           colleague's pages too, so the area holding them is not yours alone. */
        openBundleFromFile(async () => {
          if (here) { here.joined = todayISO(); await Spaces.save(); }
          go("today");
          if (here) openJoinedSummary(here.name);
        });
      }},
        el("span", {class: "k"}, CAP.dirPicker ? "2" : "1"),
        el("span", {}, el("b", {}, "An invite or a vault file"), el("br"),
          el("span", {style: "color:var(--fg3);font-size:12.5px"},
            "The .md file they sent you."))),
      CAP.dirPicker ? null : el("div", {style: "color:var(--fg3);font-size:12px;margin-top:10px;line-height:1.5"},
        "This browser cannot open folders. Ask for an invite file, or open GroupToDo on a computer " +
        "in Chrome or Edge to use the shared folder itself.")),
    foot: [el("button", {class: "btn ghost", onclick: () => { who.keep(); closeModal(); openOnboarding(); }}, "Back")],
    onClose: who.keep,
  });
  setTimeout(() => who.input.focus(), 30);
}
