async function diskRootOf(space) {
  const kept = PREF.get(diskRootKey(space));
  if (kept) return kept;
  const b = space === V.space ? V.backend : null;
  if (b && b.kind === "http") {
    const sp = Spaces.get(space);
    try {
      const r = await fetch(String(sp && sp.server || "").replace(/\/$/, "") + "/api/ping");
      const vault = r.ok && (await r.json()).vault;
      if (vault) return vault;
    } catch (_) {}
  }
  return null;
}
