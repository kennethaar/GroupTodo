/* ============================================================
   OTHER WAYS TO LOOK AT THE SAME TASKS
   A list is the right default and the wrong shape for some questions. Three
   more, all reading the very same blocks -- nothing here is a second copy or a
   separate mode, and anything you change in one is changed everywhere.

   Board     where is everything up to
   Calendar  what lands on which day
   Graph     what is connected to what
   ============================================================ */


/* The order a project actually travels in, which is not the order the folders
   happen to sort in: parked, running, stalled, finished, dropped. */
const BOARD_STATUS_COLUMNS = ["2", "1", "3", "0", "-"];

/* What is being dragged: the kind of thing, and every item travelling with it.
   A drop has to know the kind, because a task's state is a word on its line and
   a project's status is the folder it lives in; it has to know the items,
   because a drag can carry a whole handful of cards picked out with ctrl-click
   rather than only the one under the cursor. */
let DRAGGED = null;

/* What is picked out right now. One kind at a time -- a task and a project do
   not move to the same place, so a selection that mixed them could not be
   dropped anywhere -- and ids only, because the cards themselves are rebuilt on
   every redraw. For a task the id is the block id; for a project, its path. */
const BOARD_SEL = {kind: null, mode: null, ids: new Set()};

/* The cards on screen, so a drag can turn the picked ids back into the things
   they stand for. Rebuilt by each board render, which also means a card scrolled
   away behind "show more" is simply not part of the drag. */
let BOARD_ITEMS = new Map();
const boardKey = (kind, id) => kind + ":" + id;
