function writeTombstones(map) {
  const parts = Array.from(map.entries()).map(([p, t]) => p + "@" + t);
  settingsPage().props.deleted = parts.join(";");
  V.dirty.add(SETTINGS_PATH);
  scheduleFlush();
}
