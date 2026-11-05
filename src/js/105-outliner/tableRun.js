// A table command, done as one step that Undo takes back, the caret following it.
function tableRun(path, b, cmd, bi, col) {
  const was = {title: b.title, body: b.body.slice()};
  const to = tableEdit(b, cmd, bi, col);
  if (!to) return;
  pushUndo({run: () => {
    if (!getPage(path)) return false;
    b.title = was.title; b.body = was.body.slice();
    touch(path); render();
    return true;
  }});
  touch(path); render();
  tableFocusRow(b, to.bi, to.at);
}
