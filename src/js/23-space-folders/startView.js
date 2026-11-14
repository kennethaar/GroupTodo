/* draw: false is for start-up, which draws once itself when everything it
   opens is in. Drawn here as well, the first screen of a big vault was drawn
   twice in a row (#231). */
/* Where an area opens: the Journal, on a phone too. A phone is mostly for
   capture, and Next is one tap away; opening there sent you away from the
   page you came to write in. A link still opens what it points at. */
function startView() { return "today"; }
