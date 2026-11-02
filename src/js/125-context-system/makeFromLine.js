/* The one door all five go through, so the key and the menu row cannot drift
   apart. Contexts keep their own picker: a context is phone or errand, never
   the sentence somebody just typed, so offering the line as a name would be
   offering a mistake. */
function makeFromLine(path, block, kindKey, at) {
  if (kindKey === "task") { makeTask(path, block); return; }
  if (kindKey === "context") { makeContextFromLine(path, block, at); return; }
  openMakeLinkPicker(path, block, kindKey);
}
