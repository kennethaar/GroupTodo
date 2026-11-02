/* Once a minute: the "updated 12 min ago" stays true, and a due fetch runs --
   but not while someone is typing, since new meetings redraw the page. */
let CAL_LAST_KEY = 0;
