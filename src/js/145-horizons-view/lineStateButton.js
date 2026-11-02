/* The tick on an embedded or queried line, acting the same as a row's. */
function lineStateButton(space, path, b) {
  return holdable(el("button", {class: "tick", data: {state: b.state},
    title: b.state === "DONE" ? "Not done after all (hold for every state)" : "Done (hold for every state)"}, ...tickParts(b.state, b)),
    () => inSpace(space, () => tapTaskState(path, b)), () => lineStateMenu(path, b, space, false));
}
