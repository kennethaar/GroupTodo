/* After one folder is back, ask for the next area still waiting for its own.
   Each needs its own click (the browser asks only on one), so this is a new
   dialog, not a loop. The open area is left out: the panel in place of its
   pages already asks for it. Without this, an area that was not open at
   start stayed on browser storage after a reload, unasked (#346). */
function offerNextFolder() {
  const next = [...PENDING_GRANT.keys(), ...LOST_FOLDER].find(n => n !== Spaces.active);
  if (next) offerFolderBack(next);
}
