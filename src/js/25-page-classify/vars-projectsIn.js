const projectsIn = code => allPages(p => statusDirOf(p) === code && !isHorizonPage(p));
/* Same list, but across every visible space and carrying which space each is in. */
const projectsInVisible = code =>
  acrossSpaces(() => projectsIn(code).map(path => ({path, space: V.space})));
