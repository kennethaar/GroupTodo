function setHostText(host, text, caret) {
  if (!host.isContentEditable) {
    host.value = text;
    host.setSelectionRange(caret, caret);
    return;
  }
  host.textContent = text;
  const tn = host.firstChild;
  const r = document.createRange();
  if (tn && tn.nodeType === 3) { r.setStart(tn, Math.min(caret, tn.length)); r.collapse(true); }
  else { r.selectNodeContents(host); r.collapse(false); }
  const sel = getSelection();
  sel.removeAllRanges(); sel.addRange(r);
}
