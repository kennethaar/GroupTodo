function reportGroupLabel(key, by) {
  if (by !== "month") return key;
  return new Date(key + "-01T00:00:00Z")
    .toLocaleDateString(undefined, {month: "long", year: "numeric", timeZone: "UTC"});
}
