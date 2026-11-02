/* A calendar meeting deleted from a day page, or cut from it to be pasted
   somewhere else, stays gone: its key goes on the page's one cal_deleted:: line,
   and the next import does not bring it back. Each day page remembers which
   meetings it held (page._cal, not written), so any edit that takes one away
   counts -- except the importer's own, which run inside calQuietly. A meeting
   that comes back to the page, by undo or a paste, comes off the line.
   Some calendars give a meeting a new UID on a later fetch, so the line also
   holds what the meeting looked like (~ and a hash of its title and time):
   under a new UID it is still the one you deleted from that day. */
let CAL_OWN_EDIT = 0;
