/* The start times to pick from (#486, #489): the page's own time, if any, and
   the next whole and half hours after it. */
function presentWaitTimes(path) {
  const now = slideWaitAt(path);
  const t = new Date(Date.now() + 5 * 60000);
  t.setMinutes(t.getMinutes() < 30 ? 30 : 60, 0, 0);
  const times = [];
  for (let i = 0; i < 6; i++, t.setMinutes(t.getMinutes() + 30)) {
    const text = t.getHours() + ":" + String(t.getMinutes()).padStart(2, "0");
    if (text !== now?.text) times.push(text);
  }
  return {now, times};
}
