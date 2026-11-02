/* A phone's camera takes pictures of 3 to 8 MB, far more than a note needs
   and too much to carry in a vault file. So a photo is drawn again at most
   1600 px on its longer side, as a JPEG, before it is kept -- a few hundred
   KB. A picture already small, or one the browser cannot draw (HEIC on most
   of them), is kept as it came, and so is anything the redraw makes bigger. */
const PHOTO_MAX_PX = 1600;
