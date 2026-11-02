/* ---------- the line, drawn as boxes to fill in ----------
   The words stay the line's text: click the name and you are typing
   "tracker-pullups_krrr:: 100/8/4/2" again. The boxes write that same text. */
function paintTrackerLine(line, txt, path, b) {
  const old = line.querySelector(":scope > .trkw");
  if (old) old.remove();
  const t = parseTracker(b.title);
  line.classList.toggle("trkline", !!t);
  if (!t) return false;
  txt.innerHTML = trackerLabelHtml(t);
  line.append(trackerWidget(t, text => { b.title = text; touch(path); }, {date: dayOfPath(path)}));
  const prev = prevValueEl(path, "tracker:" + t.name);
  if (prev) line.querySelector(":scope > .trkw").append(prev);
  return true;
}
