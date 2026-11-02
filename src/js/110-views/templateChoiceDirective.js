/* Everything else the file carries. The value reads as words and keeps its
   links clickable through the menu rather than inside the pill: a link nested
   in a control is two things to press in one. */
function templateChoiceDirective(value) {
  const m = /^\+([\^_]?)([A-Za-z0-9_-]+)\/$/.exec(trim(value || ""));
  return m ? {direction: m[1] || null, folder: m[2]} : null;
}
