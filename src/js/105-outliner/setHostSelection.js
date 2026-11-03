function setHostSelection(host, from, to) {
  if (!host.isContentEditable) { host.setSelectionRange(from, to); return; }
  const tn = host.firstChild;
  if (!tn || tn.nodeType !== 3) return;
  const r = document.createRange();
  r.setStart(tn, Math.min(from, tn.length));
  r.setEnd(tn, Math.min(to, tn.length));
  const sel = getSelection();
  sel.removeAllRanges(); sel.addRange(r);
}
