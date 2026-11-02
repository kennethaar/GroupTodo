function openAreaHorizons(name) {
  if (name && name !== Spaces.active) openSpace(name, {view: "horizons", horizonArea: name});
  else go("horizons", {horizonArea: name || null});
}
