/* ============================================================
   THE MENU UNDER THE LINE
   Click a line and a menu opens right under it: what the line is, its state,
   when it is due, where it is done, who has it, whose work it is, which
   project it belongs to and whether it comes back. Each row shows its key,
   so the menu teaches the keys by being used. Setting any of them makes the
   line a task, except the organisation, which is just a link.
   ============================================================ */
let FLY = null;                 // {txt, path, page, block, box, open, hi}
let FLY_LIT = null;             // {id, k}: the row a key just reached, kept across the redraw
const FLY_KEYS = {KeyT: "kind", KeyD: "due", KeyC: "ctx", KeyP: "who", KeyO: "org", KeyJ: "proj", KeyR: "rep", KeyM: "meet", KeyE: "ask", KeyU: "tell"};
const STATE_WORD = {TODO: "To do", DOING: "Doing", WAIT: "Waiting", HOLD: "On hold", DONE: "Done", CANCELLED: "Cancelled"};
