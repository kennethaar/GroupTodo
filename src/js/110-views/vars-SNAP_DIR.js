/* ---------- snapshots (#254) ----------
   When a chapter moves on to another stage, a copy of it as it was is kept in
   8/snapshots/, archived so search puts it last. Revise then shows what has
   changed since: the paragraphs gone and the paragraphs new. */
const SNAP_DIR = join(DIRS.lists, "snapshots");
const isSnapshotPath = path => String(path || "").startsWith(SNAP_DIR + "/");
