const activeHorizons = () => {
  const on = horizonProfile().active;
  return HORIZONS.filter(h => on.includes(h.key));
};
const horizonActive = key => horizonProfile().active.includes(key);
