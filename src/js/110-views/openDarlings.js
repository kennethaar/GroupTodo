/* The darlings, newest first: where each came from, and Put back. */
function openDarlings() {
  const list = el("div", {class: "darlinglist"});
  const draw = () => {
    list.textContent = "";
    if (!darlings().length) list.append(el("p", {class: "empty"}, "Nothing cut yet. /darling on a line cuts it, or the sentence the caret is in."));
    for (const b of darlings()) {
      const from = blockProp(b, "chapter") ? "chapter " + blockProp(b, "chapter") : nameShown(namesIn(blockProp(b, "from") || "")[0] || "");
      list.append(el("div", {class: "relrow darling"},
        el("span", {class: "nm"}, linkWords(trim(b.title)) || "(empty)"),
        el("span", {class: "sub"}, [from, blockProp(b, "cut")].filter(Boolean).join(" · ")),
        el("button", {class: "textbtn", onclick: () => { putDarlingBack(b); draw(); }}, "Put back")));
    }
  };
  draw();
  modal({center: true, title: "Darlings", body: list,
    foot: [el("button", {class: "btn ghost", onclick: () => { closeModal(); openPage(darlingsPage() && DARLINGS_PATH); }}, "Open the page"),
           el("button", {class: "btn primary", onclick: closeModal}, "Done")]});
}
