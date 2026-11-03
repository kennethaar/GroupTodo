/* draw: false is for start-up, which draws once itself when everything it
   opens is in. Drawn here as well, the first screen of a big vault was drawn
   twice in a row (#231). */
/* Where an area opens: on a phone Next, the list of what to do now; on a
   wider screen the Journal. PHONE is defined further down, read at call time. */
function startView() { return PHONE.matches ? "next" : "today"; }
