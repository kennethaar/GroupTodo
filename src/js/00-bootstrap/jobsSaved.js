function jobsSaved(msg, level) {
  for (const j of JOBS) if (j.untilSaved) j.finish(msg, level);
}
