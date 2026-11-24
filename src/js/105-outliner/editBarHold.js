/* #395: the line tools open on a row of their own above the line, and the
   page scrolls by that row so the line you clicked stays under the pointer.
   Runs change(), then scrolls whatever holds the node by as much as the node
   moved. Where the page cannot scroll that far (a short page), the line
   moves instead. */
function editBarHold(node, change) {
  if (!node || !node.isConnected) { change(); return; }
  const t0 = node.getBoundingClientRect().top;
  change();
  if (!node.isConnected) return;
  const d = node.getBoundingClientRect().top - t0;
  if (Math.abs(d) < 0.5) return;
  let s = node.parentElement;
  while (s && s !== document.body) {
    const oy = getComputedStyle(s).overflowY;
    if ((oy === "auto" || oy === "scroll") && s.scrollHeight > s.clientHeight) break;
    s = s.parentElement;
  }
  (s && s !== document.body ? s : document.scrollingElement).scrollTop += d;
}
