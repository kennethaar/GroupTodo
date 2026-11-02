/* ============================================================
   22_SPACES
   Separate folders for separate parts of a life: Work, Private,
   Volunteer. A space is a COMPLETE, self-contained vault -- its own
   journals, projects, contexts, checklists and its own horizons, right
   up to its own purpose and vision.

   That matters for sharing. The unit you hand to someone is a whole
   space: a folder you share in OneDrive or Dropbox, or one exported
   markdown file. Nothing from another space is inside it, so colleagues
   who get Work cannot see Private, and family who get Home cannot see
   Work. The separation is the folder boundary, not a filter in the UI
   that someone could switch off.

   Each space picks its own storage, so Work can live in the company
   OneDrive while Private lives in iCloud and never touches it.
   ============================================================ */
/* A space's colour is how you tell its rows apart when several are on screen,
   so it is worth choosing rather than accepting. The first six cycle as new
   spaces are created; the palette below is what the picker offers, and any
   hex at all is allowed past that. Like the visibility toggles, the colour is
   held in this device's own list of spaces, never inside a space, so it does
   not travel in a folder you share. */
const SPACE_COLORS = ["#6aa3ff", "#5ecfc0", "#ff9f6b", "#c792ea", "#e0b050", "#4fbf7b"];
const SPACE_PALETTE = [
  ["#6aa3ff", "Blue"],   ["#38bdf8", "Sky"],    ["#5ecfc0", "Teal"],
  ["#4fbf7b", "Green"],  ["#9bcf3f", "Lime"],   ["#e0b050", "Amber"],
  ["#ff9f6b", "Orange"], ["#ff6b6b", "Red"],    ["#f06595", "Pink"],
  ["#c792ea", "Violet"], ["#818cf8", "Indigo"], ["#94a3b8", "Slate"],
];
