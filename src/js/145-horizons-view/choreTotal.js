/* The time a list of chores takes (#282): the sized ones added up, the rest
   counted as unsized, never guessed. "1 h 15 min + 1 unsized"; "" if empty. */
function choreTotal(list) {
  let mins = 0, unsized = 0;
  for (const a of list) { const m = estMinutes(a.title); if (m) mins += m; else unsized++; }
  return [mins ? minutesText(mins) : "", unsized ? (mins ? "+ " : "") + unsized + " unsized" : ""].filter(Boolean).join(" ");
}
