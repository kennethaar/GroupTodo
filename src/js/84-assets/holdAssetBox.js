/* A picture is drawn afresh with every redraw, and until it has loaded it has
   no height. The page under it was then too short for the scroll it had, so
   ticking a task jumped the page up (#382). The size it was last drawn at is
   kept and held until the picture is there again. */
function holdAssetBox(img, key) {
  const box = ASSET_BOX.get(key);
  if (box) { img.style.width = box[0] + "px"; img.style.height = box[1] + "px"; }
  const done = () => {
    img.style.width = img.style.height = "";
    if (img.isConnected && img.offsetHeight) ASSET_BOX.set(key, [img.offsetWidth, img.offsetHeight]);
  };
  img.addEventListener("load", done, {once: true});
  img.addEventListener("error", () => { img.style.width = img.style.height = ""; }, {once: true});
}
