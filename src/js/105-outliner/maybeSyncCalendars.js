/* Today, a timer and coming back to the app ask for this; it fetches in the
   background, at most once per `everyMin`. */
function maybeSyncCalendars(everyMin = CAL_EVERY_MIN) {
  if (!calFeeds().length || CAL_SYNCING) return;
  // Not before the app has read its folders, nor into an area whose folder is not there yet.
  if (!INIT_DONE || READING.size || calNotOnFolder(calHome())) return;
  if (Date.now() - (+PREF.get("calendar.tried", "0") || 0) < everyMin * 6e4) return;
  setTimeout(() => syncCalendars(), 0);
}
