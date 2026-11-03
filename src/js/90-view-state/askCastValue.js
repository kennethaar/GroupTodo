/* A value on a character's page, asked for in a line. Empty takes it off. */
function askCastValue(path, prop, title) {
  promptInput({title, label: pageTitle(path), value: oneLine(getPage(path)?.props?.[prop]), cta: "Save", onSave: v => {
    const page = getPage(path);
    if (oneLine(v)) page.props[prop] = oneLine(v); else delete page.props[prop];
    touch(path);
    render();
  }});
}
