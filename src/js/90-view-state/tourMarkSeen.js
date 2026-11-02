/* Seen is per device and per person, like "last seen" for notifications: it is
   about what you have looked at, so it has no business in the shared files. */
function tourMarkSeen(id) { if (TOUR_DESTS[id]) PREF.set("tour.seen." + id, "1"); }
