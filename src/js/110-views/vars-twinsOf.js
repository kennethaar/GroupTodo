// The group a project is in, if it has look-alikes.
const twinsOf = (space, path) => projectTwins().find(g => g.rows.some(r => r.space === space && r.path === path)) || null;

// Everybody else who works in an area: its members, less you.
const othersIn = space => inSpace(space, membersNow).filter(m => !m.me).map(m => m.name);
