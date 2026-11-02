function relDropOnCard(card, target) {
  card.addEventListener("dragover", e => {
    if (!relDragged().length) return;
    e.preventDefault();
    e.stopPropagation();
    card.classList.add("rel-over");
  });
  card.addEventListener("dragleave", () => card.classList.remove("rel-over"));
  card.addEventListener("drop", e => {
    const rows = relDragged();
    if (!rows.length) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    DRAGGED = null;
    for (const source of rows) {
      const kinds = [relKind(source), relKind(target)];
      if (kinds.includes("person") && kinds.includes("org")) relLinkPeople(source, target);
      else if (!source.block && !target.block && ["person", "org", "context"].includes(relKind(source))) {
        inSpace(target.space, () => pageLinkPropAdd(target.path, relKind(source), relRef(source)));
        render();
      } else relAddParent(target, source);
    }
  });
}
