async function initSpaces() {
  await Spaces.load();
  await detectServer();
  if (Spaces.list.length) return;

  // An existing single vault from before spaces existed becomes one space.
  let legacy = null;
  try { legacy = await IDB.get("kv", "dirHandle"); } catch (_) {}
  // A sync server set up by hand was asked for; the one serving this page
  // is only offered, unless this browser has nowhere else to keep things.
  const asked = safeLS.get("gtd.server");
  const server = asked || SERVER_BASE;

  if (legacy) {
    await IDB.set("kv", "dir:Personal", legacy).catch(() => {});
    await Spaces.add({name: "Personal", kind: "fs", label: legacy.name});
  } else if (asked || firstAreaOnServer(server)) {
    await Spaces.add({name: "Personal", kind: "http", server});
  } else {
    // Nothing to migrate yet: a placeholder the spaces wizard may replace.
    await Spaces.add({name: "Personal", kind: "local", legacyFlat: true, placeholder: true});
  }
}
