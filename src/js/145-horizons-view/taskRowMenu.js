/* The row's one menu: its states first, then the rest. */
function taskRowMenu(a) {
  chipMenu(plainTitle(a.title), "task", [...stateRows(a),
    ["r", "Refile", "to a project, responsibility or context · Alt+G", () => inSpace(a.space, () => openRefile(a.path, a.block))],
    ["o", "Open the page", null, () => openPageIn(a.space, a.path)],
  ]);
}
