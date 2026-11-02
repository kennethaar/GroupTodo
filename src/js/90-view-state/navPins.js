function navPins() {
  const shown = [];
  for (const pin of pins()) {
    const space = pin.space || "";
    if (space && space !== V.space && !(LOADED.has(space) && visibleSpaces().includes(space))) continue;
    const title = inSpace(space, () => getPage(pin.path) ? pageTitle(pin.path) : null);
    if (title == null) continue;
    const here = state.view === "page" && state.pagePath === pin.path && (Spaces.active || "") === (space || V.space || "");
    const node = el("button", {
      class: "nav-item small pin" + (here ? " active" : ""),
      "aria-current": here ? "page" : null,
      title: title + (multiSpace() && space ? " · " + space : "") + " · drag to reorder",
      onclick: () => openPageIn(space, pin.path),
    },
      el("span", {class: "ic bw"}, PIN_ICON[inSpace(space, () => pageKind(pin.path))] || ICON.pages),
      el("span", {class: "lbl"}, title),
      el("span", {class: "unpin", role: "button", title: "Unpin", "aria-label": "Unpin " + title,
        onclick: e => {
          e.stopPropagation();
          const list = pins(), i = list.findIndex(p => (p.space || "") === space && p.path === pin.path);
          if (i >= 0) { list.splice(i, 1); setPins(list); }
        }}, "✕"));
    node.draggable = true;
    node.addEventListener("dragstart", e => {
      PIN_DRAG = pin; node.classList.add("dragging");
      try { e.dataTransfer.effectAllowed = "move"; e.dataTransfer.setData("text/plain", title); } catch (_) {}
    });
    node.addEventListener("dragend", () => { PIN_DRAG = null; node.classList.remove("dragging"); });
    node.addEventListener("dragover", e => {
      if (!PIN_DRAG || PIN_DRAG === pin) return;
      e.preventDefault(); node.classList.add("over");
    });
    node.addEventListener("dragleave", () => node.classList.remove("over"));
    node.addEventListener("drop", e => {
      node.classList.remove("over");
      const moving = PIN_DRAG; PIN_DRAG = null;
      if (!moving || moving === pin) return;
      e.preventDefault();
      const same = (a, b) => (a.space || "") === (b.space || "") && a.path === b.path;
      const list = pins().filter(p => !same(p, moving));
      const to = list.findIndex(p => same(p, pin));
      list.splice(to < 0 ? list.length : to, 0, moving);
      setPins(list);
    });
    shown.push(node);
  }
  return shown.length ? [el("div", {class: "nav-sep"}), ...shown] : [];
}
