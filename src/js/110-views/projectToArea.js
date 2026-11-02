function projectToArea(path) {
  const title = pageTitle(path);
  const {items, same} = rankedAreas(title);
  listPicker({
    title: "Turn “" + title + "” into a responsibility",
    hint: "type the name · enter picks · an existing one takes the project's lines · esc cancels",
    items, typeahead: true,
    label: r => r.label,
    detail: r => r.path === null ? "new responsibility" : r === same ? "same name · merge into it"
      : r.score > 0 ? "similar · merge into it" : "merge into it",
    onPick: r => projectToAreaAs(path, r.path),
  });
}
