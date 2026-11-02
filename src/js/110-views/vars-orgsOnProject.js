/* Which of this project's organisations somebody works at. */
const orgsOnProject = (r, name) => { const orgs = projectOrgs(r).map(o => o.toLowerCase());
  return inS(r, () => personOrgs(name)).filter(o => orgs.includes(o.toLowerCase())); };
