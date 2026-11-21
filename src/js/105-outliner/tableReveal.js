/* Reveal Rows | Columns on the table bar (#469), one step Undo takes back.
   Rows is the default and writes nothing; columns is reveal:: columns. */
function tableReveal(path, b, cols) {
  if (slideTableCols(b) === cols) return;
  const key = Object.keys(b.props).find(k => k.toLowerCase() === "reveal");
  const was = key ? b.props[key] : null;
  const put = v => {
    for (const k of Object.keys(b.props)) if (k.toLowerCase() === "reveal") delete b.props[k];
    if (v) b.props.reveal = v;
  };
  put(cols ? "columns" : null);
  pushUndo({run: () => {
    if (!getPage(path)) return false;
    put(was);
    touch(path); render();
    return true;
  }});
  touch(path); render();
}
