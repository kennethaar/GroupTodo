/* ============================================================
   PEOPLE -- who is carrying what
   ============================================================ */
function peopleRows() {
  return memo("peopleRows", () => {
    const me = whoAmI();
    const rows = new Map();
    const add = (name, space) => {
      if (!trim(name)) return null;
      const k = slugPerson(name);
      if (!rows.has(k)) rows.set(k, {name, spaces: new Set(), aliases: new Set(), member: false, me: samePerson(name, me)});
      const r = rows.get(k);
      if (space) r.spaces.add(space);
      return r;
    };
    if (me) add(me).member = true;
    acrossSpaces(() => {
      for (const p of allPeople()) {
        const r = add(personName(p), V.space);
        for (const a of pageAliases(p)) r.aliases.add(a);
        if (isMemberPage(p)) r.member = true;
        if (isHouseholdPage(p)) r.household = true;
      }
      for (const m of members()) add(m.name, V.space).member = true;
      return [];
    });
    for (const a of leafActions()) if (a.assignee) add(a.assignee, a.space);
    const owing = new Map();
    for (const a of waitingRows()) for (const who of waitsOn(a)) {
      const k = slugPerson(who);
      owing.set(k, (owing.get(k) || 0) + 1);
    }
    for (const r of rows.values()) {
      r.open = openActionsOf(r.name);
      r.late = r.open.filter(a => a.due && a.due < todayISO()).length;
      r.owes = r.me ? 0 : owing.get(slugPerson(r.name)) || 0;
      r.seen = r.me ? "here now" : (r.member ? (lastSeenOf(r.name) ? "last seen " + lastSeenOf(r.name) : "not seen yet") : "outside the area");
    }
    const ment = personMentions();
    for (const r of rows.values()) r.mentions = ment.get(slugPerson(r.name)) || 0;
    // You first, then whoever the open work names most, then everyone it does not.
    return Array.from(rows.values()).sort((a, b) => (b.me - a.me) || (b.mentions - a.mentions) || a.name.localeCompare(b.name));
  });
}
