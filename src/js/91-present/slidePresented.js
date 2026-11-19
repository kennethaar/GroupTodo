/* The pages shown as slides on this device (#433), so their outline is read
   as a talk afterwards. With `mark` the page is noted as presented. */
function slidePresented(path, mark = false) {
  const key = V.space + "\u0000" + path;
  let list;
  try { list = JSON.parse(PREF.get("present.pages", "[]")); } catch (e) { list = []; }
  if (!Array.isArray(list)) list = [];
  if (!mark || list.includes(key)) return list.includes(key);
  PREF.set("present.pages", JSON.stringify([key, ...list].slice(0, 100)));
  clearMemo();
  return true;
}
