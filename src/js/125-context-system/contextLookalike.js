function contextLookalike(name) {
  const me = name.toLowerCase();
  const kin = c => (c = c.toLowerCase()) === me || c.startsWith(me + "/") || me.startsWith(c + "/");
  return contextList().filter(c => !kin(c)).map(c => ({c, s: ctxLikeness(name, c)})).filter(x => x.s > 0)
    .sort((a, b) => b.s - a.s || a.c.localeCompare(b.c))[0]?.c || null;
}
