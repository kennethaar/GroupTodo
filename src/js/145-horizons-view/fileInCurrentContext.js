/* ---------- the context a new node lands in ----------
   You are standing in @phone when you hang a step off a project, so the step
   is a phone call: filing it anywhere else would be a lie, and asking every
   time turns a mindmap into a form. So it is filed where you are standing and
   the toast says so, with one button for the times it does not belong there.
   Ignore the toast and nothing happens, which is the point. */
function fileInCurrentContext(space, path, block, said) {
  if (!state.context || !block || hasContextLink(block.title)) return false;
  const ctx = state.context;
  const setTo = pick => inSpace(space, () => {
    block.title = trim(trim(block.title).replace(/\s*\[\[c\/[^\]]+\]\]/g, "")) + " [[c/" + pick + "]]";
    createLinkedPages(block.title);
    touch(path);
  });
  setTo(ctx);
  // One toast, not two: the thing that happened, and the one correction to it.
  notify((said ? said + ", " : "") + "filed under @" + ctx, "info", {
    label: "Not @" + ctx + "?",
    run: () => openContextPicker("Which context does this belong to?", pick => {
      if (pick === ctx) return;
      setTo(pick);
      notify("Moved to @" + pick);
      render();
    }),
  });
  return true;
}
