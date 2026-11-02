/* A read that finishes while you type draws the screen once you stop: the
   lines on it are still the ones from before the read (#232). */
let RENDER_OWED = false;
