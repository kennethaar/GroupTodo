const clDeal = (path, b) => { const s = clDealt(); s.add(clKey(path, b)); clSetDealt(s); };
/* pending: a line whose answer opened a box, known by its words then; skip:
   lines sent to the back of the deck; undos: each answer this session, the
   day page before it, newest last, so Undo that steps back more than one (#365). */
let CL = {pending: null, skip: new Set(), undos: [], aim: 0};
