/* The slides in a window of their own (#515), and the presenter window
   (#431). Both are kept after a talk ends, so the next talk shows in them
   again instead of opening new ones. SLIDES_SOON waits out a burst of edits
   on the page before the slide is drawn again. */
let SLIDES_WIN = null;
let PRESENTER_WIN = null;
let SLIDES_SOON = 0;
