const inS = (r, fn) => inSpace(r.space, fn);
const pageNames = (r, kind) => inS(r, () => allPages(q => pageKind(q) === kind).map(p => [pageTitle(p), pageTitle(p)]));

/* How much each option is already used across the projects of the card's own
   area, so the ten shown first are the ten you are likeliest to want. */
const solLive = r => inS(r, () => ["1", "3", "2"].flatMap(code => projectsIn(code)).map(path => ({space: r.space, path})));
