/* ---------- your wording, back to the tasks ----------
   A line reworded in the note is usually a better line than the one in the
   vault, so it is offered back. Only the task's own words change: what it is
   about stays the project's name unless it came out of the line itself, its
   links stay where their words still stand, and what the words no longer
   carry, the tags and the person it is asked of, goes at the end. */
function askTitleFrom(title, it, name) {
  const {s, t} = it.edit;
  const project = trim(it.project || "");
  let core;
  if (!it.q) core = project ? t.replace(new RegExp("\\s*\\(" + askEsc(project) + "\\)\\s*$"), "") : t;
  else {
    const was = askQuestionParts(it, name);
    const ownSubject = !project && !!was.subject && !(it.context && it.context[0] && it.context[0].text === was.subject);
    core = ownSubject && s ? s.replace(/[.!?:]*$/, ".") + " " + t : t;
  }
  let out = trim(core);
  if (!out) return "";
  const tail = [];
  for (const raw of String(title).match(/\[\[(?:[^\]]|\](?!\]))+\]\]/g) || []) {
    const shown = plainTitle(raw), at = shown ? out.toLowerCase().indexOf(shown.toLowerCase()) : -1;
    const person = /^\[\[p\//i.test(raw) ? trim(raw.slice(4, -2).split(/[\]|#]/)[0]) : "";
    if (at >= 0) out = out.slice(0, at) + raw + out.slice(at + shown.length);
    // The person it is asked of, so it still goes to them as a question; a
    // link to anybody else is gone with the words you took out.
    else if (person ? it.q && samePerson(person, name) : true) tail.push(raw);
  }
  for (const tag of tagsIn(title))
    if (!new RegExp("(^|\\s)#" + askEsc(tag) + "(?![\\p{L}\\p{N}_\\-/])", "iu").test(out)) tail.push("#" + tag);
  return trim([out, ...tail].join(" "));
}
