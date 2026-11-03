/* Tab and Shift+Tab in a table row go from cell to cell. Past the last cell
   Tab goes on to the next row, or makes one. False outside a table, so Tab
   still indents there. */
function tableTab(e, path, b, i, txt) {
  if (e.key !== "Tab" || e.ctrlKey || e.altKey || e.metaKey) return false;
  const text = lineText(txt);
  if (i < 0 ? b.state || !TABLE_ROW_RE.test(text) : i >= tableRows(b)) return false;
  e.preventDefault();
  const pipes = [];
  for (let k = 0; k < text.length; k++) if (text[k] === "|" && text[k - 1] !== "\\") pipes.push(k);
  const [at] = caretOffsets(txt);
  let j = 0;
  while (j + 1 < pipes.length && pipes[j + 1] < at) j++;
  const start = k => Math.min(pipes[k] + (text[pipes[k] + 1] === " " ? 2 : 1), text.length);
  if (e.shiftKey) { if (j > 0) setHostText(txt, text, start(j - 1)); return true; }
  if (j + 2 < pipes.length) { setHostText(txt, text, start(j + 1)); return true; }
  const next = i < 0 ? 1 : i + 1;
  if (next < tableRows(b)) {
    txt.blur();
    tableFocusRow(b, next);
    return true;
  }
  return tableEnter(path, b, i, txt) || true;
}
