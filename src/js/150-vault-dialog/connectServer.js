async function connectServer(base) {
  const sp = Spaces.get(Spaces.active);
  const taken = Spaces.list.find(x => x.name !== Spaces.active && x.kind === "http" && x.server === trim(base));
  if (taken) {
    notify(`That server already holds ${taken.name}. Give ${sp.name} its own.`, "error");
    return;
  }
  try {
    const b = Backends.http(base);
    await loadFromBackend(b);
    sp.kind = "http"; sp.server = base; delete sp.legacyFlat;
    await Spaces.save();
    await seedIfEmpty();
    scanVerbs(); closeModal(); render();
    notify(sp.name + " synced with " + b.label);
  } catch (e) {
    notify("Server not reachable: " + e.message, "error");
  }
}
