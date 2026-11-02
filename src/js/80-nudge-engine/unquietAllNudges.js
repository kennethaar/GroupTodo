function unquietAllNudges() {
  for (const id of Object.keys(NUDGE_PLAIN).concat(["review"])) PREF.set("nudge.quiet." + id, "");
}
