const orgLinks = name => { const r = orgLinkCounts().get(name.toLowerCase()); return r ? r.people + r.projects : 0; };
const personLinks = p => (p.mentions || 0) + personOrgs(p.name).length;
const byLinks = (links, nameOf) => (a, b) => (links(b) - links(a)) || nameOf(a).localeCompare(nameOf(b));
