/* ============================================================
   142_ONBOARDING -- pick a front door on first run
   ============================================================ */
/* One question first, because every answer after it depends on it: were you
   invited into somebody's area, or are you starting your own? Asked last, as it
   used to be, the folder had already been taken as yours by the time anybody
   said they were sent it. A baked invite or an invite file answers the
   question by itself, and never reaches this screen. */
function openOnboarding() {
  const pick = (key, title, blurb, go) => el("button", {class: "pick", onclick: go},
    el("span", {class: "k"}, key),
    el("span", {}, el("b", {}, title), el("br"),
      el("span", {style: "color:var(--fg3);font-size:12.5px"}, blurb)));
  modal({
    center: true, title: "Welcome to GroupToDo",
    body: el("div", {},
      /* Why it can be shared, in two lines. How it works, they find out by
         using it. */
      el("div", {class: "field"},
        el("div", {style: "color:var(--fg2);font-size:13.5px;line-height:1.55"},
          "Write notes and tasks as you go. GroupToDo sorts them into projects, people and dates for you - no filing first."),
        el("div", {style: "color:var(--fg3);font-size:12.5px;line-height:1.55;margin-top:6px"},
          "It is really just text files in a folder you already have. No server, no accounts."),
        /* Said here rather than in a notify this very dialog covers -- and with
           no storage the answers below cannot be remembered either, so this
           screen is what every reload opens on until the file is saved. */
        CAP.persist === "memory" ? el("div", {style: "color:var(--warn);font-size:12.5px;line-height:1.55;margin-top:8px"},
          "This browser stores nothing for this page, so none of it survives closing " +
          "the tab - this screen included. Use Vault & sync → Save vault file before " +
          "you go.") : null),
      el("div", {class: "field", style: "margin-bottom:4px"},
        el("label", {}, "How are you starting?")),
      pick("1", "Somebody invited me",
        "A colleague shared a folder with you, or sent you an invite or a vault file.",
        () => { closeModal(); openOnboardJoin(); }),
      pick("2", "I am starting my own",
        "Just start writing - for you alone, or to share with others later.",
        () => { closeModal(); openOnboardOwn(); }),
      pick("3", "I have used GroupToDo before",
        "At another web address or on another computer. Pick the folders you already have.",
        () => { closeModal(); openOnboardBack(); })),
    onKey: e => {
      if (e.key === "1") { closeModal(); openOnboardJoin(); return true; }
      if (e.key === "2") { closeModal(); openOnboardOwn(); return true; }
      if (e.key === "3") { closeModal(); openOnboardBack(); return true; }
      return false;
    },
  });
}
