function visibleSpaces() {
  const names = storedVisible();
  if (names.length) return names;
  if (Spaces.active) return [Spaces.active];
  return Spaces.list.length ? [Spaces.list[0].name] : [];
}
