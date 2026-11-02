/* ---------- moving one to another area ----------
   A tracker belongs to the area whose templates bring it in. Moving it takes
   its line out of the other areas' templates for today on and puts it in the
   same templates of the new one; the day it was moved from, and today and
   the days after, carry their values across. Earlier days stay where they
   were written: that is the history, and Trackers reads every area anyway. */
const trackerKeyIn = (page, name) => {
  let key = null;
  const see = t => { if (!key && t && t.name === name) key = t.key; };
  walkBlocks(page.blocks || [], b => see(parseTracker(b.title)));
  for (const k of Object.keys(page.props || {})) see(parseTracker(k + "::"));
  return key;
};
