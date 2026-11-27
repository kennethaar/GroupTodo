/* The picture a bullet shows in its place in the list (#491), or "": a line
   with no words that is only a picture, ![](…), or has one in its notepad.
   A line with words keeps its notepad picture for the picture place (#464). */
function slideBulletPic(b) {
  if (!b || typeof b !== "object" || slideWords(b)) return "";
  return slidePicture(b.title || "") || slideNotes(b).cover;
}
