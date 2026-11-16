/* Read (#420): every part as one text, each under its name, the same lines
   as on its page. Book's Read, for any page. */
function viewPageRead(c, path) {
  pageParts(path).forEach((p, i) => c.append(el("div", {class: "readch"},
    el("div", {class: "readhead"}, el("span", {class: "n"}, String(i + 1)),
      el("button", {class: "nm", title: "Open it", onclick: () => openPage(p.path)}, p.name)),
    inSpace(V.space, () => pageOutline(p.path, {prose: true, newText: "New paragraph"})))));
}
