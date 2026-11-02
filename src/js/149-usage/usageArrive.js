function usageArrive(place) {
  if (place === USAGE.place) return;
  USAGE.place = place;
  usageBump(place, 0, 1);
}
