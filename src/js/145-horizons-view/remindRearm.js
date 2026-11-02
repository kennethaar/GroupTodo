/* A moved time is a new reminder: whatever was said or snoozed for this task
   on this device is forgotten, so it goes off again at the new time. */
function remindRearm(block) {
  const tail = "|" + plainTitle(block.title);
  const seen = remindSeen();
  let gone = false;
  for (const k of Object.keys(seen)) if (k.endsWith(tail) && !k.startsWith("bday|")) { delete seen[k]; gone = true; }
  if (gone) PREF.set(REMIND_PREF, JSON.stringify(seen));
}
