/* Messages -> rows, with the grouping decisions already made. */
function threadRows(msgs) {
  const rows = [];
  let lastDay = null, lastWho = null, lastAt = 0, firstUnread = true;
  for (const m of msgs) {
    const day = dateIn(msgAt(m)) || todayISO();
    if (day !== lastDay) { rows.push({sep: chatDayLabel(day)}); lastDay = day; lastWho = null; }
    if (isUnread(m) && firstUnread) { rows.push({newHere: true}); firstUnread = false; }
    const at = Date.parse(msgAt(m)) || 0;
    // Same person, within five minutes: one speech, not two.
    const grouped = msgAuthor(m) === lastWho && (at - lastAt) < 5 * 60000;
    rows.push({msg: m, grouped});
    lastWho = msgAuthor(m); lastAt = at;
  }
  return rows;
}
