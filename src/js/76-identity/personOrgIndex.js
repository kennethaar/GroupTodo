function personOrgIndex() {
  return memo("personOrgs", () => {
    const orgs = new Map(), people = new Map();
    const add = (name, org) => {
      const k = slugPerson(name);
      if (!k) return;
      if (!people.has(k)) people.set(k, {name, orgs: []});
      const r = people.get(k);
      if (org && !r.orgs.some(o => o.toLowerCase() === org.toLowerCase())) r.orgs.push(org);
    };
    eachVisibleSpace(() => {
      for (const p of allPages(q => pageKind(q) === "org")) {
        orgs.set(baseName(p).toLowerCase(), baseName(p));
        for (const who of linksWith(getPage(p)?.props, "p/")) add(who, baseName(p));
      }
      for (const p of allPeople()) {
        add(personName(p));
        for (const o of linksWith(getPage(p)?.props, "o/")) add(personName(p), o);
      }
    });
    for (const r of people.values()) {
      const m = /^(.+?)\s*\(([^()]+)\)$/.exec(r.name) || /^(.+)(?:\s[-–—]|,)\s*(.+)$/.exec(r.name);
      const org = m && orgs.get(trim(m[2]).toLowerCase());
      if (org) add(r.name, org);
      r.orgs = r.orgs.map(o => orgs.get(o.toLowerCase()) || o);
      r.bare = m && r.orgs.some(o => o.toLowerCase() === trim(m[2]).toLowerCase()) ? trim(m[1]) : r.name;
    }
    return people;
  });
}
