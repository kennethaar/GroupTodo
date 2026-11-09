/* The last read of the folder, timed, as Check the folder shows it (#342).
   Opening a file and reading its text are told apart: when the text is what
   takes the time, files not changed since could be skipped; when opening is,
   they could not. */
function readTimingText(t) {
  const span = ms => ms < 1000 ? Math.round(ms) + " ms" : (ms / 1000).toFixed(1) + " s";
  const each = ms => t.files ? span(ms / t.files) : "-";
  const when = new Date(t.at).toTimeString().slice(0, 5);
  return [
    "Read at " + when + ".",
    "Listing " + t.dirs + " folders took " + span(t.listMs) + ".",
    "Reading " + t.files + " files (" + Math.round(t.kb) + " KB), up to " + t.atOnce + " at a time, took " + span(t.readMs) + ".",
    "Per file on average: opening " + each(t.openMs) + ", reading the text " + each(t.textMs) + ".",
    t.slowest.length ? "Slowest:\n" + t.slowest.map(([p, ms]) => "  " + span(ms) + "  " + p).join("\n") : "",
  ].filter(Boolean).join("\n");
}
