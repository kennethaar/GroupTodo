// New words for the line Quick is asking about; it is still asked (#523).
function qcEdit(path, b, text) {
  CL.editing = null;
  const t = trim(text || "");
  if (t && t !== b.title) { b.title = t; createLinkedPages(t); touch(path); }
  render();
}
