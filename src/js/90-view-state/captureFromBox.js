function captureFromBox(input) {
  const raw = input.value;
  if (!trim(raw)) return;
  input.value = "";
  const made = captureLine(raw);
  render();
  if (!made) return;
  const where = multiSpace() ? " in " + Spaces.active : "";
  const undo = {label: "Undo", run: () => {
    const page = getPage(made.path);
    if (page && removeBlockFrom(page, made.block)) { touch(made.path); render(); }
  }};
  if (made.when.length) offerKeepWords(made.when, made.path);
  else if (!made.who) notify("Added to today's page" + where + ".", "info", undo);
  if (!startsWithVerb(made.block.title) && !gtdQuiet())
    notify("Start with a verb you could film: Call, Draft, Buy.", "warn");
}
