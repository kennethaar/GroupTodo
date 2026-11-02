/* ---------- one key to change what a thing is ----------
   Alt with a status (- 1 2 3 8) or a kind (p person, o org, c context,
   z note) turns whatever has the caret -- or the dot the mindmap is on --
   into that. A page moves to that kind's folder; a line becomes a link to a
   new page of that kind, or, when it already links a project, moves the
   project. */
const CONVERT_KEYS = {
  Minus: "-", Digit1: "1", Digit2: "2", Digit3: "3", Digit8: "8",
  KeyP: "person", KeyO: "org", KeyC: "context", KeyZ: "zettel",
};
const STATUS_KEYS = ["-", "1", "2", "3", "8"];
