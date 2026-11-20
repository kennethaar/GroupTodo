/* The sorting card comes first in Still to do when a project page has three
   or more sequences, unless it says parallel:: yes: they all go at once. */
let ACT_SORT = null;    // {key, asked: [titles], past: [{page, asked}]} while one is being sorted
const actSortKey = r => (r.space || "") + "|" + r.path;
const actSortTitle = b => withoutMarks(linkWords(trim(withoutEst(b.title).replace(/\[\[c\/[^\]]+\]\]/g, ""))));
function actSortDue(r) {
  if (solPassNo() !== 0 || !r || isJournalPath(r.path) || r.projectPath !== r.path) return false;
  if (inS(r, () => /^yes$/i.test(trim(String(getPage(r.path)?.props?.parallel || ""))))) return false;
  return actSortRoots(r).length >= 3;
}
