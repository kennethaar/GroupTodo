/* ============================================================
   THE PLEX -- one thought in the middle, its relatives around it
   The force-directed map answers "what does all of this look like". It is bad
   at the other question, "what is around THIS", because the thing you care
   about is wherever the physics happened to leave it and everything else is
   drawn at the same weight.

   So: TheBrain's arrangement. The page you are on sits in the middle, what
   links TO it stands above, what it links to hangs below, and what shares a
   parent with it sits out to the sides. Their own relatives form a fainter,
   smaller outer ring: that is the whole of the 2.5D, size and opacity standing
   in for distance, with everything gliding rather than jumping so you can see
   where a thing went when the middle changes.

   Nothing here is a second copy of anything. A relation is a [[link]] in the
   markdown, which is what it already was.
   ============================================================ */
const PLEX = {
  anim: null,            // the running rAF, so a redraw cannot leave two
  pos: new Map(),        // key -> {x, y, r, a} where things are NOW
  drag: null,            // {from, x, y} while pulling a link out of a node
  cursor: null,          // key the keyboard is pointing at, which is not the middle
  key: null,             // the keydown listener this screen has in place
};

const plexFocus = () => state.graphFocus || null;
