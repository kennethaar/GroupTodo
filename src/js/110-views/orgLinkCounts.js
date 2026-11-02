function orgLinkCounts() {
  return memo("orgLinkCounts", () => {
    const m = new Map();
    const bump = (o, k) => { const r = m.get(o.toLowerCase()) || {people: 0, projects: 0}; r[k]++; m.set(o.toLowerCase(), r); };
    for (const r of personOrgIndex().values()) for (const o of r.orgs) bump(o, "people");
    for (const r of workingProjects()) for (const o of projectOrgs(r)) bump(o, "projects");
    return m;
  });
}
