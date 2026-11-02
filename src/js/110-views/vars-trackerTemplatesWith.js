/* ---------- taking one off ----------
   The cross on a day takes the tracker off that day only, and says so if a
   journal template will keep bringing it back. Stop tracking takes it out of
   every journal template in every area, and off today and later days where it
   is still empty. What was written on earlier days stays: that is the history. */
const trackerTemplatesWith = name => [...LOADED.keys()].flatMap(sp => inSpace(sp, () =>
  allPages(p => p.startsWith(DIRS.lists + "/") && pageHasTracker(getPage(p), name)).map(p => ({sp, p}))));
