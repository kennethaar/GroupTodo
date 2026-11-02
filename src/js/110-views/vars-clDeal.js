const clDeal = (path, b) => { const s = clDealt(); s.add(clKey(path, b)); clSetDealt(s); };
/* pending: a line whose answer opened a box, known by its words then; skip:
   lines sent to the back of the deck; undo: the day page before the last answer. */
let CL = {pending: null, skip: new Set(), undo: null, aim: 0};
