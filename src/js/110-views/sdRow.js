function sdRow(r, n) {
  return el("li", {},
    n ? el("span", {class: "n"}, String(n)) : null,
    el("button", {class: "textbtn nm", translate: "no", title: "Open the page", onclick: () => previewPage(r.space, r.path)},
      inS(r, () => pageTitle(r.path))),
    el("button", {class: "btn sm", title: sdK().actTitle, onclick: () => sdK().take(r)}, sdK().act));
}
