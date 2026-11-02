/* How often each person is named in work still going: an open task or
   waiting-for that is assigned to them or links [[p/them]], and an active or
   waiting project that lists them in with::. Keyed by slugPerson. */
function personMentions() {
  return memo("personMentions", () => {
    const m = new Map(), bump = name => { const k = slugPerson(name); m.set(k, (m.get(k) || 0) + 1); };
    for (const a of leafActions()) {
      if (!OPEN_STATES[a.state]) continue;
      const here = new Set();
      if (a.assignee) here.add(slugPerson(a.assignee));
      for (const l of linksIn(String(a.block?.text || a.block?.title || a.text || ""))) {
        const t = trim(l.split("][")[0]);
        if (t.startsWith("p/")) here.add(slugPerson(t.slice(2)));
      }
      for (const k of here) m.set(k, (m.get(k) || 0) + 1);
    }
    for (const r of [...projectsInVisible("1"), ...projectsInVisible("3")])
      for (const p of projectPeople(r)) bump(p);
    return m;
  });
}
