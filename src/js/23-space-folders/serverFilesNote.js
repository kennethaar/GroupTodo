/* "  (3 files)" after a server folder's path, or nothing when not known. */
function serverFilesNote(o) {
  return typeof o.files === "number" ? "  (" + o.files + (o.files === 1 ? " file)" : " files)") : "";
}
