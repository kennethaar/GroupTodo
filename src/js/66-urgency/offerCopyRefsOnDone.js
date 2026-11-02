/* Asked when a project is completed, while the lines are still easy to find. */
function offerCopyRefsOnDone(path) {
  const n = linkedRefsToCopy(path).length;
  if (!n) return;
  modal({
    center: true, title: "Copy its linked references?", hint: "y / n",
    body: el("div", {},
      el("div", {class: "field"},
        el("div", {style: "color:var(--fg2);font-size:13.5px"},
          n + " line" + (n === 1 ? "" : "s") + " elsewhere link" + (n === 1 ? "s" : "") + " to " + pageTitle(path) +
          ". Copy them to the bottom of the project, so what it gathered is kept in one place? " +
          "The originals stay where they are.")),
      pickRow("y", "Copy them here", "under the page each came from", () => { closeModal(); copyLinkedRefs(path); }),
      pickRow("n", "Leave them", "the project page's ⋯ can do it later", () => closeModal())),
    onKey: e => {
      if (e.key === "y") { closeModal(); copyLinkedRefs(path); return true; }
      if (e.key === "n") { closeModal(); return true; }
      return false;
    },
  });
}
