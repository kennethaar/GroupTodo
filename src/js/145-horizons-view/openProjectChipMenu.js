function openProjectChipMenu(a) {
  chipMenu(a.project, "the project this action sits in", [
    a.projectPath ? ["a", "Open " + a.project, pageRef(a.projectPath), () => openPageIn(a.space, a.projectPath)] : null,
    ["b", "Move it to another project", null, () => inSpace(a.space, () => openRefile(a.path, a.block))],
    ["c", "Out of this project", "back to today's inbox", () => inSpace(a.space, () => unfileFromProject(a.path, a.block))],
  ]);
}
