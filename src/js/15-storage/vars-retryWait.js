/* Storage that was unreachable usually comes back -- a laptop lid, a sleeping
   Pi, a phone off wifi -- so keep trying on a widening interval rather than
   waiting for the next keystroke, which is what used to re-arm the timer. */
let retryWait = 0;
