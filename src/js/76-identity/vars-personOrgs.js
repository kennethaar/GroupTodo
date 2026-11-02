const personOrgs = name => personOrgIndex().get(slugPerson(name))?.orgs || [];
// The name without the organisation it ends in, when that is where they work.
const personBareName = name => personOrgIndex().get(slugPerson(name))?.bare || name;
const personNameAt = name => [personBareName(name), ...personOrgs(name)].join(" · ");
// Everybody else who goes by the same name.
const namesakesOf = name => [...personOrgIndex().values()].filter(r => !samePerson(r.name, name) &&
  r.bare.toLowerCase() === personBareName(name).toLowerCase()).map(r => r.name);
/* Family, Relatives, Friends and Creators are circles, not employers: a
   friend can work at Acme as well, so being in one of them never counts as a
   second organisation. Anybody at two real ones is allowed, but is said. */
const CIRCLE_ORGS = ["Family", "Relatives", "Friends", "Creators"];
const isCircleOrg = org => CIRCLE_ORGS.some(c => c.toLowerCase() === trim(String(org || "")).toLowerCase());
const personWorkOrgs = name => personOrgs(name).filter(o => !isCircleOrg(o));
const manyOrgsWarning = name => { const w = personWorkOrgs(name);
  return w.length > 1 ? personBareName(name) + " is at " + w.length + " organisations: " + w.join(", ") + "." : ""; };
