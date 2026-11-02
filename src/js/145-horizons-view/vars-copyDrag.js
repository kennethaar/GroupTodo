/* True when the gesture is a copy rather than a move: ctrl, or cmd on a Mac,
   held at the moment of the drop. The same bargain a file manager makes, so
   nothing new has to be learned to take a copy of a page into another space. */
const copyDrag = e => !!(e && (e.ctrlKey || e.metaKey));
