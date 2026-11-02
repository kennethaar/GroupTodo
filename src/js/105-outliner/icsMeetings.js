/* The meetings in a calendar file between two instants, one per time each
   happens. A moved or changed single time (RECURRENCE-ID) replaces that one
   time of the series. */
function icsMeetings(text, fromMs, toMs) {
  const events = icsParse(text);
  const val = (ev, k) => ev[k] && ev[k][0] ? trim(ev[k][0].value) : "";
  const ridOf = ev => ev["RECURRENCE-ID"] ? icsTimeOf(ev["RECURRENCE-ID"][0], ev.DTSTART && ev.DTSTART[0].params.TZID) : null;
  const moved = new Set(events.filter(ev => ev["RECURRENCE-ID"]).map(ev => val(ev, "UID") + "@" + ridOf(ev)));
  const out = [];
  for (const ev of events) {
    const uid = val(ev, "UID") || calHash(val(ev, "SUMMARY") + val(ev, "DTSTART"));
    const rid = ridOf(ev);
    const people = [];
    for (const p of [...(ev.ORGANIZER || []), ...(ev.ATTENDEE || [])]) {
      if (/^(ROOM|RESOURCE)$/i.test(p.params.CUTYPE || "")) continue;
      const name = trim(p.params.CN || p.value.replace(/^mailto:/i, ""));
      if (name && !people.some(x => x.toLowerCase() === name.toLowerCase())) people.push(name);
    }
    // The description's own points, up to where the dial-in boilerplate starts.
    const agenda = [];
    for (const raw of val(ev, "DESCRIPTION").split("\n")) {
      const l = trim(raw.replace(/^\s*(?:[-*•]|\d+[.)])\s+/, ""));
      if (/^[_\-=~]{5,}|microsoft teams|join (the )?meeting|zoom\.us|meet\.google|^click here/i.test(l)) break;
      if (l && l.length < 200) agenda.push(l);
      if (agenda.length >= 8) break;
    }
    for (const o of icsOccurrences(ev, fromMs, toMs)) {
      if (rid == null && moved.has(uid + "@" + o.start)) continue;
      out.push(Object.assign(o, {
        key: calHash(uid + "@" + (rid ?? o.start)),
        summary: val(ev, "SUMMARY") || "Meeting",
        cancelled: /^CANCELLED$/i.test(val(ev, "STATUS")) || /^cancel(l)?ed:/i.test(val(ev, "SUMMARY")),
        people: people.slice(0, 15), agenda,
      }));
    }
  }
  return out;
}
