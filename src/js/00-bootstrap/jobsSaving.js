function jobsSaving(n, total) {
  for (const j of JOBS) if (j.untilSaved) j.set(n, total, "saving " + n + " of " + total + " files");
}
