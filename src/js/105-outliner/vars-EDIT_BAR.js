/* ---------- the toolbar at the foot of the page ----------
   Moving a line, indenting it and turning it into a task, zettel, project or
   responsibility all have keys, but a phone has no Tab and no Alt, and keys
   nobody has learned yet are not there either. So while a line is being
   written, a row of buttons for them sits at the foot of the screen, above the
   on-screen keyboard. Pressing one does not take the caret out of the line,
   so the next press acts on the same line, wherever it went. */
const EDIT_BAR = [
  {k: "up", ic: "\u2191", label: "Up", tip: "Move the line up (Alt+Shift+\u2191)"},
  {k: "down", ic: "\u2193", label: "Down", tip: "Move the line down (Alt+Shift+\u2193)"},
  {k: "out", ic: "\u21E4", label: "Outdent", tip: "Outdent (Shift+Tab)"},
  {k: "in", ic: "\u21E5", label: "Indent", tip: "Indent (Tab)"},
  {k: "kind", ic: "\u2610", label: "Task", tip: "Make it a task (Alt+T)"},
  {k: "mkzet", ic: "\u25C7", label: "Zettel", tip: "Turn into zettel (Alt+Z)"},
  {k: "mkproj", ic: ICON.projects, label: "Project", tip: "Make it a project (Alt+1)"},
  {k: "mkarea", ic: "\u25CE", label: "Area", tip: "Make it a responsibility (Alt+I)"},
  {k: "photo", ic: "\uD83D\uDCF7", label: "Photo", tip: "Take a photo for this line"},
  {k: "image", ic: "\uD83D\uDDBC", label: "Image", tip: "Add an image to this line"},
];
