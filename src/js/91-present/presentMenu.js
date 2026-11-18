// ▶ Present ▾ (#431): the two ways to present, the same as ☰ › Present from here.
function presentMenu(path, root = null) {
  chipMenu("Present", null, lettered([
    ["Present", "the slides, full screen", () => presentStart(path, {root})],
    ["With presenter window", "notes, what comes next and a timer on your own screen (P)",
      () => presentStart(path, {root, presenter: true})],
  ]));
}
