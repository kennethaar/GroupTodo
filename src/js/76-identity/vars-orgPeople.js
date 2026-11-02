const orgPeople = org => [...personOrgIndex().values()]
  .filter(r => r.orgs.some(o => o.toLowerCase() === org.toLowerCase())).map(r => r.name)
  .sort((a, b) => a.localeCompare(b));
