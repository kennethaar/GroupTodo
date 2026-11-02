/* Resolves true only if they actually joined. The two flags that say "this
   invite is spent" belong to the Join button alone: Not now has to leave both
   the invite and the welcome screen still waiting, or a misclick strands
   somebody in an app that never asked them anything. */
function openInviteArrived(cfg, text) {
  const who = cfg.from ? cfg.from : "A colleague";
  return new Promise(resolve => {
  let settled = false;
  const done = joined => { if (!settled) { settled = true; resolve(joined); } };
  modal({
    onClose: () => done(false),
    center: true, title: who + " shared \u201C" + cfg.space + "\u201D with you",
    body: el("div", {},
      el("div", {class: "field"},
        el("div", {style: "font-size:13.5px"},
          "Everything in that area is in this file. Open it and it is yours too - " +
          "the same projects, the same lists, the same people.")),
      cfg.kind === "fs" ? el("div", {class: "field"},
        el("label", {}, "One thing to do afterwards"),
        el("div", {style: "color:var(--fg2);font-size:13px"},
          "They keep it in a folder called \u201C" + (cfg.folder || cfg.space) + "\u201D. " +
          "Make sure it is shared with you, then point the app at it so you both write to " +
          "the same files. A browser will not let them hand the folder over in a file, so " +
          "this is the one step nobody can do for you.")) : null,
      cfg.kind === "http" ? el("div", {class: "field"},
        el("label", {}, "Nothing else to set up"),
        el("div", {style: "color:var(--fg2);font-size:13px"},
          "This area lives on a server at " + cfg.server + ", and that address is in the " +
          "file. You will be asked for the password the first time.")) : null),
    foot: [
      el("button", {class: "btn ghost", onclick: closeModal}, "Not now"),
      el("div", {style: "flex:1"}),
      el("button", {class: "btn primary", onclick: async () => {
        // Answered before the dialog goes: closing it is itself what reports a
        // decline, so the answer has to be in before the close fires.
        done(true);
        closeModal();
        const r = await applyInvite(cfg, text);
        notify("You are in " + r.name + ". " + syncSummary(r.report));
        /* A space shared with you is the one place an unsigned change is worth
           nothing: everything here already carries somebody else's name. So the
           question onboarding would have asked gets asked here instead, and the
           getting-started strip is turned on to carry the rest. */
        PREF.set("coach", "1");
        askJoinerName(r.name, cfg.from, () => openJoinedSummary(r.name, () => {
          if (r.cfg.kind === "fs" && CAP.dirPicker) openSpaceStorageSetup({firstRun: false});
        }));
      }}, "Join " + cfg.space),
    ],
  });
  });
}
