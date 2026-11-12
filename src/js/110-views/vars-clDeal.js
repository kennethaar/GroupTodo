const clDeal = (path, b) => { const s = clDealt(); s.add(clKey(path, b)); clSetDealt(s); };
/* pending: a line whose answer opened a box, known by its words then; skip:
   lines sent to the back of the deck; undo: the day page before the last answer. */
// undos: each answer this session, newest last, so Undo that can step back more than one (#365).
let CL = {pending: null, skip: new Set(), undos: [], aim: 0};
