function horizonFact(path) {
  const base = HORIZONS.find(x => x.page === baseName(path));
  const h = base ? horizonMeta(base.key) : null;
  return {
    key: "horizon", raw: null,
    pills: () => [factPill(h ? h.h + " · " + h.name : "horizon", "fquiet",
      h ? h.alt : "one of the horizons", () => chipMenu(h ? h.name : "Horizon", h ? h.alt : "", [
        ["a", "Go to the horizons", "all six, top down", () => go("horizons")],
      ]))],
  };
}
