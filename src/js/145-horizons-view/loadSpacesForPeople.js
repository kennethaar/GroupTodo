function loadSpacesForPeople() {
  const pending = Spaces.list.filter(s => !LOADED.has(s.name) && !PEOPLE_LOAD_TRIED.has(s.name));
  if (!pending.length || PEOPLE_LOADING) return;
  PEOPLE_LOADING = true;
  pending.forEach(s => PEOPLE_LOAD_TRIED.add(s.name));
  Promise.allSettled(pending.map(s => loadSpaceRecord(s.name))).then(() => {
    PEOPLE_LOADING = false;
    if (state.view === "people") render();
  });
}
