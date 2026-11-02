/* ---------- moving around the grid without the mouse ----------
   Escape puts the grid into select mode: the arrows walk from node to node and
   Enter centres on the one you land on. It is Escape because that is the key
   you already press to get your hands off the text, and because in select mode
   the arrows are free -- nothing is being typed into.

   Selection is real DOM focus rather than a class of our own, so Enter already
   does the right thing, a screen reader says what is selected, and nothing has
   to be kept in step by hand. Movement is geometric: the nearest node in the
   direction you pressed, measured from the middle of each. That survives the
   phone layout, where the same cells stack into one column, with no second set
   of rules to write or get wrong. */
function aroundNodes(grid) { return [...grid.querySelectorAll(".achip")]; }
