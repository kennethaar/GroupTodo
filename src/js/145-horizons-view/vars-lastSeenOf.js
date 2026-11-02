const lastSeenOf = name => sinceLabel(personProp(name, SEEN_PROP));

/* ---------- reading a conversation ----------
   The ordinary rules for making a thread scannable rather than a wall: group
   what one person said in one go instead of repeating their name, separate the
   days, show a time you can actually use, and put one line where the unread
   starts rather than tinting every message. */
const initialsOf = name => trim(name).split(/\s+/).filter(Boolean)
  .slice(0, 2).map(w => w[0].toUpperCase()).join("") || "?";
