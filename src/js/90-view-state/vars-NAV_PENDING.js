/* A click in the sidebar shows where you are going at once -- the item lit and
   the heading up -- and draws the view a frame later, so a big vault never
   leaves the click looking ignored. Clicking on before it is drawn goes to the
   last one clicked. */
let NAV_PENDING = 0;
