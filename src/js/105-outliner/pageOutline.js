/* opts: facts (the page's values at the top), readonly (somebody else's day
   page), and for the trail when a line is focused: root and title, with where
   each of them goes back to -- rootGo and parentGo, as [view, opts]. branch
   shows that one line, with the trail left to whoever asked (the pane). */
function pageOutline(path, opts = {}) {
  const page = getPage(path);
  const box = el("div", {class: "card"});
  const outline = el("div", {class: "outline" + (opts.readonly ? " readonly" : "") +
    (opts.prose ? " prose" : "")});
  /* Prose keeps the line you write in at the middle of the screen, as a
     typewriter keeps its line in one place (#244). */
  if (opts.prose) outline.addEventListener("focusin", e => {
    if (tpActive()) return;   // the teleprompter holds the caret's line there itself (#324)
    const blk = e.target.closest(".blk");
    if (blk) requestAnimationFrame(() => blk.scrollIntoView({block: "center", behavior: "smooth"}));
  });
  // The pane at the right has its own focus, whatever the view beside it is focused on.
  const focusId = opts.branch || (SIDE_DRAWING ? null : BRANCH_FOCUS.get(page));
  const trail = focusId ? branchTrail(page.blocks, focusId) : null;
  if (focusId && !trail && !opts.branch) BRANCH_FOCUS.delete(page);
  const root = trail ? trail[trail.length - 1] : null;
  if (opts.facts && !root) outline.append(pageFactsBlock(path, {trackersOnly: opts.facts === "trackers"}));
  if (opts.facts && !root && isEmailPage(path)) outline.append(emailActions(path));
  for (const b of root ? [root] : shownLines(page.blocks, opts)) outline.append(outlineBlock(path, page, b, opts));
  box.append(opts.readonly ? outline : attachLineSelect(outline, path));
  /* A pick belongs to the outline that made it, and this one has just been
     rebuilt, so anything picked in another page's outline is let go of. */
  if (LINE_SEL.ids.length && LINE_SEL.path !== path) lineSelClear(false);
  if (LINE_SEL.ids.length) requestAnimationFrame(paintLineSel);
  const addLine = () => {
    const nb = newBlock({title: ""});
    if (root) { root.children = root.children || []; root.children.push(nb); root.collapsed = false; }
    else page.blocks.push(nb);
    return nb;
  };
  if (!opts.readonly) {
    const btn = el("button", {
      class: "newline", onclick: () => { const nb = addLine(); touch(path); render(); focusBlock(nb.id); },
    }, opts.newText ? null : el("span", {class: "bul", "aria-hidden": "true"}, "•"),
      root ? "New line under this one" : opts.newText || "New line");
    /* Files dropped here each get a new line with the link, as a drop on a
       line does (#390). */
    btn.addEventListener("dragover", e => {
      if (!Array.from((e.dataTransfer && e.dataTransfer.types) || []).includes("Files")) return;
      e.preventDefault();
      e.dataTransfer.dropEffect = "copy";
      btn.classList.add("dropping");
    });
    btn.addEventListener("dragleave", () => btn.classList.remove("dropping"));
    btn.addEventListener("drop", async e => {
      const files = Array.from((e.dataTransfer && e.dataTransfer.files) || []);
      btn.classList.remove("dropping");
      if (!files.length) return;
      e.preventDefault();
      e.stopPropagation();
      if (!canKeepFiles()) { notify("This area has nowhere to keep files.", "warn"); return; }
      const lines = files.map(() => addLine());
      touch(path);
      for (let i = 0; i < files.length; i++) await attachFilesToBlock(path, lines[i], [files[i]], null);
      const left = lines.filter(nb => !trim(nb.title));
      if (left.length) {
        const drop = list => { for (let i = list.length - 1; i >= 0; i--) if (left.includes(list[i])) list.splice(i, 1); };
        drop(root ? root.children : page.blocks);
        touch(path); render();
      }
    });
    box.append(btn);
  }
  if (!trail || opts.branch) return box;

  const space = V.space;
  const leave = to => {
    BRANCH_FOCUS.delete(page);
    if (FOCUSED && FOCUSED.page === page) FOCUSED = null;
    if (to) go(to[0], to[1]); else render();
  };
  const rootLabel = opts.root || pageTitle(path);
  const crumbs = el("div", {class: "crumbz"},
    el("button", {class: "textbtn", onclick: () => leave(opts.rootGo)}, "⤶ " + rootLabel));
  if (opts.title && opts.title !== rootLabel)
    crumbs.append(el("span", {}, "›"), multiSpace() ? spaceBadge(space) : null,
      el("button", {class: "textbtn", onclick: () => leave(opts.parentGo)}, opts.title));
  for (const b of trail.slice(0, -1))
    crumbs.append(el("span", {}, "›"),
      el("button", {class: "textbtn", onclick: () => setBranchFocus(page, b.id, path)}, branchLabel(b)));
  crumbs.append(el("span", {}, "›"), el("b", {}, branchLabel(root)),
    el("button", {class: "textbtn", style: "margin-left:auto", title: "This line and what is under it stay open at the right while you move about",
      onclick: () => pinToSide(space, path, ensureBlockId(path, root))}, svgIcon(ICON_PIN), " Pin to the right"));
  FOCUS_NODE = el("div", {}, crumbs, box);
  return el("div", {});      // the focused outline lives in FOCUS_NODE now
}
