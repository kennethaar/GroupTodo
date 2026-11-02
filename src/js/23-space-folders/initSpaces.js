async function initSpaces() {
  await Spaces.load();
  await detectServer();
  if (Spaces.list.length) return;

  // An existing single vault from before spaces existed becomes one space.
  let legacy = null;
  try { legacy = await IDB.get("kv", "dirHandle"); } catch (_) {}
  let server = null;
  server = safeLS.get("gtd.server");
  if (!server) server = SERVER_BASE;        // served by serve.py: that is the vault

  if (legacy) {
    await IDB.set("kv", "dir:Personal", legacy).catch(() => {});
    await Spaces.add({name: "Personal", kind: "fs", label: legacy.name});
  } else if (server) {
    await Spaces.add({name: "Personal", kind: "http", server});
  } else {
    // Nothing to migrate yet: a placeholder the spaces wizard may replace.
    await Spaces.add({name: "Personal", kind: "local", legacyFlat: true, placeholder: true});
  }
}
