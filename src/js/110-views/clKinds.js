/* What the line already names, by kind, so a person or a project on it is
   seen at a glance; then Mark words…, which turns words on it into one
   (#367). The words are the ones picked in the line above, or typed, so a
   keyboard and a phone get there too. Marking is not an answer: the line
   stays on the table. */
function clKinds(path, b, h3) {
  const chips = [];
  for (const ref of linksIn(b.title || "")) {
    let kind = linkKindOf(ref);
    const page = findExistingPage(ref);
    if (!kind && page && pageKind(page) === "project") kind = "project";
    if (kind) chips.push(el("span", {class: "chip clkind " + kind, translate: "no"},
      CL_KIND_LABEL[kind] + ": " + (page ? pageTitle(page) : ref.split("/").pop())));
  }
  const bar = el("div", {class: "clmark", hidden: true});
  const open = () => {
    const sel = getSelection(), picked = sel && sel.rangeCount && h3.contains(sel.anchorNode) ? trim(String(sel)) : "";
    const input = el("input", {value: picked, placeholder: "Words on the line", "aria-label": "Words to mark"});
    const mark = kind => () => {
      if (!linkWordsAs(path, b, input.value, kind)) {
        notify(trim(input.value) ? "Those words are not on the line, or are a link already." : "Pick or type the words first.", "warn");
        return;
      }
      render();
    };
    bar.replaceChildren(input,
      ...["person", "org", "context", "project"].map(k => el("button", {class: "btn sm ghost", onclick: mark(k)}, CL_KIND_LABEL[k])),
      el("button", {class: "textbtn", onclick: () => { bar.hidden = true; }}, "Cancel"));
    bar.hidden = false;
    input.focus();
  };
  return [el("div", {class: "clkinds"}, ...chips,
    // Pressing it keeps the words picked in the line.
    el("button", {class: "textbtn", onmousedown: e => e.preventDefault(), onclick: open}, "Mark words…")), bar];
}
