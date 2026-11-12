/* What the line already names, by kind, so a person or a project on it is
   seen at a glance; then Mark words…, which turns words on it into one
   (#367). The words are the ones picked in the line above, or typed, so a
   keyboard and a phone get there too. Marking is not an answer: the line
   stays on the table. */
function clKinds(path, b, h3) {
  /* Every link and #tag gets its kind, a plain page too, so what is on file
     already is plain to see (#379). */
  const title = b.title || "", chips = [], said = [];
  const chip = (kind, name, ...more) => {
    said.push(CL_KIND_A[kind] + ", " + name);
    chips.push(el("span", {class: "chip clkind " + kind, translate: "no"}, el("b", {}, CL_KIND_LABEL[kind] + ":"), " " + name, ...more));
  };
  for (const ref of linksIn(title)) {
    const page = findExistingPage(ref.split("][")[0]);
    chip(clKindOf(ref, page), page ? pageTitle(page) : ref.split("][")[0].split("/").pop());
  }
  for (const t of tagsIn(title)) chip("tag", "#" + t);
  // Nothing on the line but those: it is on file already.
  const rest = title.replace(/\[\[[\s\S]*?\]\]/g, "").replace(/(^|\s)#[\p{L}\p{N}_\-/]+/gu, "").replace(/[\s.,;:·\-–—]+/g, "");
  const already = said.length && !trim(bujoText(rest)) ? el("p", {class: "clalready", role: "note"},
    "Already on file: " + said.join("; ") + ". Something to do about it? Say so below; if not, leave it as a note.") : null;
  // A name you have a page for, written without a link: one press links it.
  for (const {kind, words, ref} of clLooseNames(title))
    chips.push(el("span", {class: "chip clkind clloose " + kind, translate: "no"},
      el("b", {}, CL_KIND_LABEL[kind] + ":"), " " + words + ", not linked ",
      el("button", {class: "textbtn", onclick: () => { if (linkWordsAs(path, b, words, kind, ref)) render(); }}, "Link it")));
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
  return [already, el("div", {class: "clkinds"}, ...chips,
    // Pressing it keeps the words picked in the line.
    el("button", {class: "textbtn", onmousedown: e => e.preventDefault(), onclick: open}, "Mark words…")), bar];
}
