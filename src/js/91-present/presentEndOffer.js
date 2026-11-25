/* A talk ended (#515): the page offers the line it ended at, so you can
   pick up editing there. Not when the caret goes back to that line anyway. */
function presentEndOffer(path, step, back) {
  const b = step && (step.k ? step.s.parts[step.k - 1] : step.s.block);
  if (!b || typeof b !== "object" || !b.id) return;
  if (String(back?.closest?.(".blk")?.dataset.id) === String(b.id)) return;
  const words = slideWords(b);
  if (!words) return;
  const home = slideHomePath(b, path);
  notify(`Ended at “${words.length > 40 ? words.slice(0, 39) + "…" : words}”`, "info", {label: "Show in page", run: () => {
    window.focus();
    jumpToSourceNode(home, b);
    focusBlock(b.id);
  }});
}
