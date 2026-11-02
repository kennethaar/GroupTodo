const orderedCols = (by, keys) => mergeColOrder(colOrder(by), keys).filter(k => keys.includes(k));

/* Whose column head is being dragged. Kept apart from DRAGGED, so no column
   takes a column for a card. */
let COL_DRAG = null;
