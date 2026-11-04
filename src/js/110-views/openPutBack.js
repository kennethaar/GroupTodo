/* What a page with putback:: holds, newest first: where each came from, and Put back. */
function openPutBack(path) {
  const list = el("div", {class: "darlinglist"});
  const draw = () => {
    list.textContent = "";
    if (!getPage(path).blocks.length) list.append(el("p", {class: "empty"}, path === DARLINGS_PATH ? "Nothing cut yet. /darling on a line cuts it, or the sentence the caret is in." : "Nothing here yet. Refile a line to this page and it can be put back."));
    for (const b of getPage(path).blocks) {
      const from = blockProp(b, "chapter") ? "chapter " + blockProp(b, "chapter") : nameShown(namesIn(blockProp(b, "from") || "")[0] || "");
      list.append(el("div", {class: "relrow darling"},
        el("span", {class: "nm"}, linkWords(trim(b.title)) || "(empty)"),
        el("span", {class: "sub"}, [from, blockProp(b, "cut")].filter(Boolean).join(" · ")),
        el("button", {class: "textbtn", onclick: () => { putBack(path, b); draw(); }}, "Put back")));
    }
  };
  draw();
  modal({center: true, title: pageTitle(path), body: list,
    foot: [el("button", {class: "btn ghost", onclick: () => { closeModal(); openPage(path); }}, "Open the page"),
           el("button", {class: "btn primary", onclick: closeModal}, "Done")]});
}
