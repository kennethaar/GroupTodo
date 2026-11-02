/* ============================================================
   149_USAGE -- which places you use, kept in your own area
   ============================================================ */
/* Whether a screen earns its place shows sixty to ninety days on, not the
   week it is new: GTD's own rule for software, the 30-60-90 test. The app
   sends nothing anywhere, so it counts here instead: on this device, per day,
   each place you were -- a screen and its reading, a kind of page, a dialog --
   how often you went there, the minutes you were active in it, and the clicks
   and keys. A finished day goes as one line onto a page in an area that is
   yours alone, where you can read it, keep it, or send it to somebody.

   Nothing you wrote is in it: pages count by kind, never by title, and a
   dialog only by the app's own fixed title. Lines are only ever added, one per
   day and device, so two devices merging the page never fight over one.

   Little use is not little worth. The weekly review is opened once a week and
   keeps the rest honest; the sidebar counts and the reminders work without
   being opened at all. So the report leads with the weeks a place was used,
   not the minutes, and the last word on each is yours: Keep, Not sure, Could go. */
const USAGE_PATH = join(DIRS.zettel, "Usage of GroupToDo.md");
const USAGE_DAYS_KEY = "usage.days", USAGE_HOME_KEY = "usage.home", USAGE_WORTH_KEY = "usage.worth";
const USAGE_TICK_S = 15;          // active time is counted in steps this long
const USAGE_IDLE_MS = 90000;      // no click or key for this long and you are not "in" it
const USAGE_WEEKS = 13;           // the report looks back 13 weeks, the 90 of 30-60-90
const USAGE_KEEP_DAYS = 120;      // unwritten days on this device, with no area to write them to
const USAGE_ABOUT = "Written by GroupToDo, one line per day and device: place visits/minutes/actions. " +
  "Nothing you wrote is in it. Vault & sync → Your use of GroupToDo reads it.";
const USAGE = {place: null, view: null, dialog: null, closed: null, lastInput: 0, lastKey: 0, days: null};

const usageOn = () => PREF.get("usage.off", "") !== "1";
