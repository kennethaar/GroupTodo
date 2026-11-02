/* Whether what comes first has been answered at all, "nothing" included. */
const chainAnswered = path => !!trim(getPage(path)?.props?.[DEPENDS_PROP] || "");

/* Everything that waits on this project. Only within the space: a chain that
   crossed spaces would be a chain you cannot see both ends of. */
const dependentsOf = path => memo("dependents:" + path, () =>
  allPages(p => statusDirOf(p) && dependsOn(p).includes(path)));
