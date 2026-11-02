function scheduleTracker(t, when, from) {
  const names = trackerTemplateNames(when, from);
  for (const name of names) addTrackerLine(name, t.key);
  const {added} = syncTrackerDays(t.name, t.key, new Set(names));
  notify(trackerTitle(t.name) + " is in " + whereWords(names) + " in Settings" +
    (added ? ", and on " + added + " day page" + (added === 1 ? "" : "s") + " already made" : "") + ".");
}
