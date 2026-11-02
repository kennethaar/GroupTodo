/* ---------- carrying the old positions over a re-centre ----------
   Centring on a node rebuilds the grid, and a rebuild is a cut: the thing you
   pressed Enter on is suddenly in the middle with no account of how it got
   there. So the positions are measured before the rebuild and every node that
   survives it is put back where it was and then released, which plays as the
   grid rearranging itself around your choice. FLIP, in other words, and the
   whole of the animation: no library, no timers, one transition. */
let AROUND_FLIP = null;
