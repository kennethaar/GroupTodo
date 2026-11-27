/* A picture written on an action's line, for its card in Review actions
   (#520). The card may be from another area than the one open, so the file
   is looked up in the card's own area. Any other file reads as its name. */
function actPic(r, alt, src) {
  const name = alt || decodeURIComponent(src.split("/").pop());
  if (!ASSET_IMAGE_RE.test(src) && !/^(blob|data|https?):/.test(src)) return el("span", {class: "chip"}, name);
  const img = el("img", {class: "asset actpic", alt: name, title: name});
  if (!isAssetPath(src)) { img.src = src; return img; }
  assetURL(src, r.space && r.space !== V.space ? r.space : undefined).then(url => {
    if (url) img.src = url;
    else img.replaceWith(el("span", {class: "asset-missing", title: "Not in this folder: " + src}, "⊘ " + name));
  }).catch(() => {});
  return img;
}
