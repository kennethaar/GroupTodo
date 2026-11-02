/* Back to the English the app wrote, wherever it is still what we put there. */
function langRevert() {
  const w = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
  for (let n = w.currentNode; n; n = w.nextNode()) {
    if (n.nodeType === 3) {
      const was = LANG.shown.get(n);
      if (was && n.nodeValue === was[1]) n.nodeValue = was[0];
      LANG.shown.delete(n);
    } else {
      const all = LANG.attrs.get(n);
      if (!all) continue;
      for (const [a, [en, shown]] of Object.entries(all)) if (n.getAttribute(a) === shown) n.setAttribute(a, en);
      LANG.attrs.delete(n);
    }
  }
}
