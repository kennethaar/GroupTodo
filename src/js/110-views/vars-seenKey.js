/* ---------- since you were last here ----------
   There is nobody to push a notification, so the app looks for itself when
   the day opens: work somebody handed me, a word on a task I am part of, and
   work I handed over that is finished. Dismissing it loses nothing -- History
   holds it, and everything before it. */
const seenKey = () => "seen:" + (V.space || Spaces.active || "");
const lastSeen = () => PREF.get(seenKey(), "");
const markSeen = () => PREF.set(seenKey(), nowStamp());
