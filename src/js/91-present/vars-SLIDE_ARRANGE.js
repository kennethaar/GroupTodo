/* Alt+drag on a slide (#487). A line or the title moves from where its
   layout puts it, kept as at:: x,y (or title-at:: on the slide's own line)
   in % of the slide; the picture pans in its frame, kept as focus:: x,y.
   A move snaps to the slide's thirds and centre when it comes near. */
const SLIDE_SNAP = [100 / 3, 50, 200 / 3];
const SLIDE_SNAP_NEAR = 1.2;          // % of the slide
const SLIDE_ARR_KEYS = ["at", "title-at", "focus"];
let SLIDE_ARR = null;                 // a drag going on: {node, s, kind, target, x0, y0, from, ...}
let SLIDE_ARR_PICK = null;            // what Alt+click picked, for Alt+arrows: {kind, id}
