function lineSelCopy() {
  const text = lineSelText();
  if (!text) return;
  const n = LINE_SEL.ids.length;
  copyText(text, n + (n === 1 ? " line copied." : " lines copied."), "Copy these lines");
  lineSelClear();
}
