/* ---------- two files, one project ----------
   Moving a project onto a shelf, into a folder or across to another space
   where a project of that name already lives used to be refused outright
   ("target already exists") -- and across spaces it silently overwrote what
   was there, which was worse. Neither is what the move meant: it is the same
   project written down twice, so the two files become one.

   The page that was already there is the one that stays: it keeps its own
   values and gains only what the arriving page stated and it did not, the
   chain becomes the union of both, and the arriving lines land underneath
   minus any that are already on it word for word. Links that pointed at the
   page that went away point at the survivor.

   Reversible while the toast is up, and precisely: only the lines that came
   across go away again and only the values the merge added are dropped, so
   anything else you changed in the meantime survives the undo. The links are
   not un-rewritten -- a blind reverse pass would also catch the links that
   pointed at the survivor all along. */
const mergeLineKey = b => (b.state || "") + "\u0000" + trim(b.title);
