/* #428 Known names not linked yet get a quiet wavy line, only on the line
   with the caret and the line under the pointer. The CSS Custom Highlight
   API draws it, so the line's words are not touched. A browser without it
   simply shows none. */
function squigglePaint() {
  if (!window.CSS || !CSS.highlights || typeof Highlight !== "function") return;
  const act = document.activeElement;
  const hosts = new Set([act && act.matches && act.matches(".blk .txt[contenteditable=true]") ? act : null, SQUIGGLE_HOVER]);
  const ranges = [];
  for (const host of hosts) if (host && host.isConnected) ranges.push(...squiggleRanges(host));
  if (ranges.length) CSS.highlights.set("unlinked", new Highlight(...ranges));
  else CSS.highlights.delete("unlinked");
}
