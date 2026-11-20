/* The picture a line shows on a slide, or "": the first ![](…) in it whose
   source is a web or data address or an image in the folder's assets. */
function slidePicture(line) {
  const src = (DECK_IMAGE_RE.exec(line || "") || [])[1];
  return src && (/^(https?|data|blob):/.test(src) || (isAssetPath(src) && ASSET_IMAGE_RE.test(src))) ? src : "";
}
