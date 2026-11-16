/* Use title "…" and ✕ at the end of a line a video or post link was pasted
   on (#404). Use makes the link [title](url); ✕ keeps it bare. Neither takes
   the caret out of the line. */
function linkTitleButton(path, b) {
  if (LINK_TITLE.id !== b.id) return null;
  const {url, label} = LINK_TITLE;
  const keep = e => e.preventDefault();
  const use = e => {
    e.stopPropagation();
    const node = e.target.closest(".blk");
    const txt = node && node.querySelector(":scope > .line > .txt");
    const live = txt && txt.parentNode.classList.contains("raw");
    dropLinkTitle();
    const was = live ? lineText(txt) : b.title || "";
    const at = was.indexOf(url);
    if (at < 0 || was.slice(Math.max(0, at - 2), at) === "](") {
      notify("The link has changed, so it was left as it is.", "warn");
      return;
    }
    const link = "[" + label + "](" + url + ")";
    const now = was.slice(0, at) + link + was.slice(at + url.length);
    /* On a line being typed, the words change where they are and the caret
       goes after the link; drawing the line again would let its blur save
       the old words over the new ones. */
    if (live) { setHostText(txt, now, at + link.length); commitLine(txt, path, b); return; }
    b.title = now;
    touch(path); noteTodoTouched(); render();
  };
  return el("span", {class: "linktitle"},
    el("button", {class: "use", title: "Show the link by this title", onmousedown: keep, onclick: use},
      "Use title “" + label + "”"),
    el("button", {class: "x", title: "Keep the link as it is", "aria-label": "Keep the link as it is",
      onmousedown: keep, onclick: e => { e.stopPropagation(); dropLinkTitle(); }}, "✕"));
}
