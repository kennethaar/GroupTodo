function projectCompletionPrompt(path) {
  const body = el("div", {},
    el("div", {class: "field"}, el("label", {}, "That was the last open todo"),
      el("div", {style: "color:var(--fg2);font-size:13.5px"},
        "A project with no next action is invisible work. What is the next step?")),
    pickRow("n", "Add a new next action", "keep it active", () => { closeModal(); openAddNextAction(path); }),
    pickRow("o", "Open the project page", "see the whole thing first", () => { closeModal(); openPage(path); }),
    pickRow("d", "Move to 0, completed", "it is done", () => { closeModal(); setProjectStatus(path, "0"); }),
    pickRow("s", "Move to 2, someday/maybe", "not now", () => { closeModal(); setProjectStatus(path, "2"); }),
    pickRow("c", "Move to -, cancelled", "never", () => { closeModal(); setProjectStatus(path, "-"); }));
  nudgeToast({
    center: true, title: "No todos left in " + pageTitle(path), hint: "n / o / d / s / c",
    body,
    onKey: e => {
      const map = {n: () => openAddNextAction(path), o: () => openPage(path), d: () => setProjectStatus(path, "0"),
                   s: () => setProjectStatus(path, "2"), c: () => setProjectStatus(path, "-")};
      if (map[e.key]) { closeModal(); map[e.key](); return true; }
      return false;
    },
  });
}
