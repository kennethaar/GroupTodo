/* The birthday a task was written for, or null when it is not a birthday task.
   Read the way the rest of the app reads birthday:: (parseBirthday). */
function birthdayTaskDay(block) {
  let said = false, bday = null;
  for (let p = block; p; p = p._parent) {
    if (BIRTHDAY_WORDS.test(linkWords(p.title || ""))) said = true;
    if (!bday) {
      for (const m of String(p.title || "").matchAll(/\[\[p\/([^\]|]+)\]\]/g)) {
        const b = parseBirthday(birthdayIn(getPage(personPath(trim(m[1].split("][")[0])))?.props));
        if (b) { bday = b; break; }
      }
    }
  }
  if (!said || !bday) return null;
  const from = addedDate(block) || dueDate(block);
  return from ? nextBirthday(bday, from).iso : null;
}
