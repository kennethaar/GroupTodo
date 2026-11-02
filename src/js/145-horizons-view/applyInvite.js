/* Put the space in place, then the pages, then say what is left to do. */
async function applyInvite(cfg, text) {
  const name = trim(cfg.space).replace(/[^\w \-]/g, "").slice(0, 40) || "Shared";
  let sp = Spaces.get(name);
  if (!sp) {
    sp = {name, kind: cfg.kind === "http" ? "http" : "local", color: cfg.color || undefined};
    if (cfg.kind === "http" && cfg.server) sp.server = cfg.server;
    sp.askedStorage = cfg.kind === "http";       // a server needs no folder
    sp.joined = todayISO();                      // somebody else's area from the first moment
    await Spaces.add(sp);
  }
  await openSpace(name);
  const report = mergeBundle(parseBundle(text));
  ensureMemberPage();
  await flush();
  render();
  markSeen();                                   // their first visit is not "news"
  return {name, report, cfg};
}
