/* The waiting screen before a talk (#486). The lines under a line written
   "(waiting)" are its slides, shown in turn, and left out of the talk. The
   start time is the page's starts:: (13:00). */
const SLIDE_WAIT_RE = /^\(waiting\)(?:\s+|$)/i;
const SLIDE_WAIT_EVERY = 10000;   // ms a waiting slide stays up
const SLIDE_WAIT_SOON = 60000;    // the last minute: the band grows
const SLIDE_WAIT_TIME_RE = /^([01]?\d|2[0-3])[:.]([0-5]\d)$/;
