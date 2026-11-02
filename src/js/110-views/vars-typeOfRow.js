/* Task types, kept apart: Purchases on their own, Reading on its own. The
   choice is the type's name, so it reads the same in every area shown. */
const typeOfRow = a => inSpace(a.space, () => { const t = a.block && taskStage(a.block); return t ? pageTitle(t.list) : ""; });
