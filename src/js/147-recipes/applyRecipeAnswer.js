/* Make the recipe page from an AI's answer, or a recipe written the same
   way by hand: k/<no> <name>, its number first among its properties. The
   path, or null when there is nothing to make it from. */
function applyRecipeAnswer(answer) {
  const r = mendRecipeAnswer(answer);
  if (!r) return null;
  const no = nextRecipeNo();
  const {path} = freePageName(DIRS.recipes, no + " " + r.title, "Recipe");
  delete r.props.no;
  putPage(path, {props: {no: String(no), ...r.props}, blocks: r.blocks});
  touch(path);
  return path;
}
