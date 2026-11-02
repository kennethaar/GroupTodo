/* Everything with a when, yours: what you are doing, not what you handed on. */
function upcomingEvents() {
  return memo("upcomingEvents", () => {
    const out = [];
    for (const a of leafActions()) {
      if (!a.mine) continue;
      const w = dueWhen(a.block);
      if (w) out.push({kind: "task", key: w.key, day: w.day, time: w.time, a, title: plainTitle(a.title)});
    }
    for (const b of birthdays())
      out.push({kind: "birthday", day: b.day, time: null, b, title: birthdayTitle(b)});
    return out;
  });
}
