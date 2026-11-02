/* Called once the line is written back. By id, not by text: writing back
   turns names into links and a trailing date into a due date, so the saved
   title is often not the text that was typed. */
function dropLineDraft(id) {
  const d = readLineDraft();
  if (d && d.id === id) forgetLineDraft();
}
