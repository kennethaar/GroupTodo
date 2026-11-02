function lineSelCut() {
  const text = lineSelText();
  if (!text) { lineSelClear(); return; }
  const n = LINE_SEL.ids.length;
  copyText(text, n + (n === 1 ? " line cut." : " lines cut."), "Copy these lines");
  lineSelRemove(null);
}
