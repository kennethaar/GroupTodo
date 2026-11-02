/* ---------- the review's fields, anywhere ----------
   Everything the review sets can be set from a project's page, its row in
   the list and its card on the board: the same field, the same options and
   the same "+ new", in a small chooser of its own. */
let SOL_EDIT = null;
const solRedraw = () => SOL_EDIT ? SOL_EDIT.redraw() : render();
