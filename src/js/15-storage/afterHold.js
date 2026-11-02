async function afterHold(name) {
  if (name === Spaces.active) {
    bindActive(name);
    migrateVault();
    await seedIfEmpty();
    scanVerbs();
    ensureJournal(todayISO());
  }
  clearMemo();
  render();
  scheduleFlush();
}
