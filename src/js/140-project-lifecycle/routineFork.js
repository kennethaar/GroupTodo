/* Asked once, in passing, and never overridden: if somebody says it really is a
   project, it is a project. A guess that insists is worse than no guess. */
function routineFork(name, then) {
  const asRoutine = () => {
    closeModal();
    const path = createChecklist(name, "routine", cadenceFrom(name));
    PREF.set("madeRoutine", "1");
    notify("Routine created: " + pageTitle(path) + ". Run it whenever it comes round.");
    openPage(path);
  };
  const asProject = () => { closeModal(); createProjectFlow(name, then); };
  nudgeToast({
    center: true, title: "That sounds like a routine", hint: "r / p",
    body: el("div", {},
      el("div", {class: "field"},
        el("div", {style: "color:var(--fg2);font-size:13.5px;line-height:1.55"},
          "A project has a finish line - something you tick off once and never think " +
          "about again. This one reads like something that comes back instead, and those " +
          "live as routines under Settings, so your project list stays a list of " +
          "things that can actually end.")),
      pickRow("r", "Make it a routine", "comes back - run it when it is due", asRoutine),
      pickRow("p", "Keep it a project", "it really does finish", asProject)),
    onKey: e => {
      if (e.key === "r") { asRoutine(); return true; }
      if (e.key === "p") { asProject(); return true; }
      return false;
    },
  });
}
