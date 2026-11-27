/* Make the slides (#483): the AI's answer, out of its ``` block and without
   the chat around it, as lines on the page: under the line it came from
   (place is that line's id), after the last of picked lines ({after: id}),
   or at the page's end (null). A picture's spaces are written %20, as a link
   needs. One Ctrl+Z takes them out. Gives the number of lines, 0 for none. */
function slideAiApply(src, place, raw) {
  let text = String(raw || "").replace(/\r\n?/g, "\n");
  const rows = text.split("\n"), open = rows.findIndex(l => /^[ \t]*```/.test(l));
  if (open >= 0) {
    const shut = rows.findIndex((l, i) => i > open && /^[ \t]*```/.test(l));
    text = rows.slice(open + 1, shut < 0 ? rows.length : shut).join("\n");
  }
  text = text.replace(SLIDE_AI_LINK_RE, (all, alt, p) => `![${alt}](${SLIDE_AI_DIR}/${slideAiName(p).replace(/ /g, "%20")})`);
  const roots = parseOutlineText(text);
  if (!roots.length) return 0;
  return inSpace(src.space, () => {
    const page = getPage(src.path);
    if (!page) return 0;
    flattenBlocks(page.blocks);
    const id = place && typeof place === "object" ? place.after : place;
    const at = id ? findBlock(id) : null;
    const host = at && at.path === src.path ? at.block : null;
    let list = page.blocks, i = list.length;
    if (host && place && typeof place === "object") { list = siblingsOf(page, host); i = list.indexOf(host) + 1; }
    else if (host) { host.children = host.children || []; list = host.children; i = list.length; }
    const n = readyPastedBlocks(roots, {});
    list.splice(i, 0, ...roots);
    touch(src.path); noteTodoTouched(); render();
    pushUndo({run: () => {
      for (const r of roots) { const k = list.indexOf(r); if (k >= 0) list.splice(k, 1); }
      touch(src.path); render();
      notify("Put back.");
      return true;
    }});
    return n;
  });
}
