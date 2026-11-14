/* ---------- the toolbar at the foot of the page ----------
   Moving a line, indenting it and turning it into a task, zettel, project or
   responsibility all have keys, but a phone has no Tab and no Alt, and keys
   nobody has learned yet are not there either. So while a line is being
   written, a row of buttons for them sits at the foot of the screen, above the
   on-screen keyboard. Pressing one does not take the caret out of the line,
   so the next press acts on the same line, wherever it went.
   Up, Down, Outdent, Indent and Notepad stay direct buttons -- a thumb reaches for them
   constantly, and so does Side panel -- everything rarer than a quick tag or
   an entity change lives there, next to the line's own menu, not behind a
   button of its own. Tagging and turning the line into something still sit
   one tap deeper, behind a Type, Tag or Media button, so the bar itself
   stays short. Every icon here is a monochrome SVG path for
   svgIcon() (vars-svgIcon.js), 24x24, drawn at one stroke weight -- except "@",
   which is already plain text and already inherits the button's colour. */
const EB_UP      = '<path d="M12 19V5M5 11l7-7 7 7"/>';
const EB_DOWN    = '<path d="M12 5v14M5 13l7 7 7-7"/>';
const EB_OUTDENT = '<path d="M3 6h18M9 12h12M3 18h18M8 9l-3 3 3 3"/>';
const EB_INDENT  = '<path d="M3 6h18M9 12h12M3 18h18M6 9l3 3-3 3"/>';
const EB_TASK    = '<rect x="4" y="4" width="16" height="16" rx="3"/>';
const EB_NOTE    = '<rect x="4" y="4" width="16" height="16" rx="3"/><circle cx="12" cy="12" r="2.5"/>';
const EB_ZETTEL  = '<path d="M12 3l9 9-9 9-9-9z"/>';
const EB_PROJECT = '<path d="M6 3v18M6 4h12l-3 4 3 4H6"/>';
const EB_AREA    = '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/>';
const EB_TAG     = '<path d="M3 11V5a2 2 0 0 1 2-2h6l10 10-8 8L3 13z"/><circle cx="7.5" cy="7.5" r="1.1"/>';
const EB_PERSON  = '<circle cx="12" cy="7" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/>';
const EB_ORG     = '<path d="M4 21V8l8-5 8 5v13"/><path d="M9 21v-6h6v6"/><path d="M9 11h.01M9 15h.01M15 11h.01M15 15h.01"/>';
const EB_CAMERA  = '<path d="M4 8h3l2-3h6l2 3h3v12H4z"/><circle cx="12" cy="14" r="3.5"/>';
const EB_IMAGE   = '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.5" cy="9.5" r="1.4"/><path d="M21 16l-5-5-4 4-3-3-6 6"/>';
const EB_MOVE    = '<path d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M8 21H5a2 2 0 0 1-2-2v-3M16 21h3a2 2 0 0 0 2-2v-3"/>';
const EB_PAD     = '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/>';
const EB_COPY    = '<rect x="4" y="4" width="12" height="14" rx="2"/><path d="M9 18v1a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-1"/>';

const EDIT_BAR = [
  {k: "up", ic: EB_UP, label: "Up", tip: "Move the line up (Alt+Shift+↑)"},
  {k: "down", ic: EB_DOWN, label: "Down", tip: "Move the line down (Alt+Shift+↓)"},
  {k: "out", ic: EB_OUTDENT, label: "Outdent", tip: "Outdent (Shift+Tab)"},
  {k: "in", ic: EB_INDENT, label: "Indent", tip: "Indent (Tab)"},
  // A phone has no Shift, so Shift+Enter's notepad needs a button (#392).
  {k: "pad", ic: EB_PAD, label: "Notepad", tip: "Write several lines in the notepad (Shift+Enter)"},
  {k: "kind", ic: EB_TASK, label: "Task", tip: "Make it a task (Alt+T)", group: "type"},
  {k: "mkzet", ic: EB_ZETTEL, label: "Zettel", tip: "Turn into zettel (Alt+Z)", group: "type"},
  {k: "mkproj", ic: EB_PROJECT, label: "Project", tip: "Make it a project (Alt+1)", group: "type"},
  {k: "mkarea", ic: EB_AREA, label: "Responsibility", tip: "Make it a responsibility (Alt+I)", group: "type"},
  {k: "meet", ic: FLY_MEETING, label: "Meeting", tip: "Make it a meeting (Alt+M)", group: "type"},
  {k: "ctx", ic: "@", label: "Context", tip: "Add a context (Alt+C)", group: "tag"},
  {k: "who", ic: EB_PERSON, label: "Person", tip: "Add a person (Alt+P)", group: "tag"},
  {k: "org", ic: EB_ORG, label: "Organisation", tip: "Add an organisation (Alt+O)", group: "tag"},
  {k: "proj", ic: "#", label: "Project", tip: "Add a project (Alt+J)", group: "tag"},
  {k: "photo", ic: EB_CAMERA, label: "Photo", tip: "Take a photo for this line", group: "media", pointerFineOff: true},
  {k: "image", ic: EB_IMAGE, label: "Image", tip: "Add an image to this line", group: "media"},
  {k: "more", ic: FLY_PANEL, label: "Side panel", tip: "Open in the side panel", tail: true},
];

/* One button per group: its own label and a fallback icon for when nothing
   in the group gives a better one (Type's is worked out from the line). */
const EDIT_BAR_GROUPS = [
  {g: "type", label: "Type", ic: EB_TASK},
  {g: "tag", label: "Tag", ic: EB_TAG},
  {g: "media", label: "Media", ic: EB_IMAGE},
];

/* The leaves a group shows right now -- Photo drops out where there is no
   camera to speak of, so a group left with one leaf can act on it directly
   instead of opening a one-item menu. */
const editBarGroupLeaves = g => EDIT_BAR.filter(r => r.group === g &&
  !(r.pointerFineOff && matchMedia("(pointer:fine)").matches));
