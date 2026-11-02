function trackerOwnColour(name) {
  const c = (trackerProp(name, "colour") || trackerProp(name, "color")).toLowerCase();
  return TRACKER_COLOURS[c] ? c : "";
}
