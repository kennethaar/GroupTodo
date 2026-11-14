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
    // What a start in seconds has to get round (#181).
    t.folders && t.folders.length ? "Slowest folders to list:\n" +
      t.folders.map(([p, ms, n]) => "  " + span(ms) + "  " + p + " (" + n + (n === 1 ? " entry)" : " entries)")).join("\n") : "",
    t.day && t.day.files.length ? "A file read alone, as today's page is: " + t.day.files.map(([p, o, x]) =>
      p + " opening " + span(o) + ", text " + span(x)).join("; ") + "." : "",
    t.unchanged ? "Unchanged since the last read: " + t.unchanged.same + " of " + t.unchanged.total +
      " files, by date and size. Kept in the browser, those need no reading." :
      t.sigs && t.sigs.size ? "Unchanged since the last read: not known yet, this is the first read on this device." : "",
  ].filter(Boolean).join("\n");
}
