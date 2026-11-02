/* ---------- events and feelings: the bullet journal's own bullets ----------
   A line that starts "o " (or "○ ") is something that happened, and "= " is
   how it felt; under another line, a feeling is about that line. Both are
   notes, never to dos. Their dot becomes ○ or =, and the letter stays in the
   file, shown while you type in the line, as a heading's # is. A line typed
   as "· " becomes a to do, so all four paper bullets are written the same
   way. On everywhere: nobody starts a line "o " or "= " by accident (#185). */
const EVENT_RE = /^(?:o|○)[ \t]+(?=\S)/;
const FEEL_RE = /^=[ \t]+(?=\S)/;
const bujoKind = (title, isTask) => isTask ? null
  : EVENT_RE.test(title || "") ? "ev" : FEEL_RE.test(title || "") ? "feel" : null;
const bujoText = title => {
  const k = bujoKind(title);
  return k ? String(title).replace(k === "ev" ? EVENT_RE : FEEL_RE, "") : String(title || "");
};
const bujoMark = kind => el("span", {class: "bjm " + kind, role: "img",
  "aria-label": kind === "ev" ? "Event" : "Feeling", title: kind === "ev" ? "Event" : "Feeling"});
const ACTION_DOT_RE = /^·[ \t ]+/;

/* # , ## , ### in front of a note make it a heading, the markdown way. The
   marks stay in the file and show while you type in the line; a task is
   never a heading. */
const HEAD_RE = /^(#{1,6})[ \t]+(?=\S)/;
const headLevel = (title, isTask) => isTask ? 0 : ((HEAD_RE.exec(title || "") || [])[1] || "").length;
