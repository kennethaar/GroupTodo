/* The day page as you wrote it, the line being asked lit up, in a box that
   scrolls (#523). A click on the line, or its pencil, edits its words. */
function qcOutline(path, b) {
  const line = k => {
    if (k !== b) return el("span", {class: "qcline" + (k.state ? " st-" + k.state.toLowerCase() : ""), translate: "no",
      html: renderInline(bujoText(k.title || ""))});
    if (CL.editing === b.id) {
      const input = el("input", {class: "qcedit", value: b.title || "", "aria-label": "The line's words"});
      let done = false;
      const end = keep => { if (done) return; done = true; if (keep) qcEdit(path, b, input.value); else { CL.editing = null; render(); } };
      input.addEventListener("keydown", e => {
        if (e.key === "Enter") { e.preventDefault(); e.stopPropagation(); end(true); }
        else if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); end(false); }
      });
      input.addEventListener("blur", () => end(true));
      return input;
    }
    const edit = () => { CL.editing = b.id; render(); };
    return el("span", {class: "qcwrap"},
      el("span", {class: "qcline qchere", translate: "no", html: renderInline(bujoText(b.title || "")),
        onclick: e => { if (!e.target.closest("a")) edit(); }}),
      // Words the AI wrote say so where they are asked about (#516 follow-up).
      cuByAI(path, b) ? el("span", {class: "qcai"}, CU_MARK + " Written by AI") : null,
      el("button", {class: "qcpen", title: "Edit the words (E)", "aria-label": "Edit the words", onclick: edit}, svgIcon(ICON_PENCIL)));
  };
  const list = blocks => el("ul", {},
    ...(blocks || []).filter(k => !isMessage(k) && (k === b || trim(k.title || "") || (k.children || []).length))
      .map(k => el("li", {class: k === b ? "on" : ""}, line(k), (k.children || []).length ? list(k.children) : null)));
  return el("div", {class: "qcout", role: "region", "aria-label": "The day, around the line"},
    el("h3", {class: "qcday"}, dayLong(baseName(path))), list(getPage(path).blocks));
}
