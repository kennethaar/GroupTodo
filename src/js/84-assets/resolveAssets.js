function resolveAssets(root) {
  for (const node of $$("[data-asset]", root || document)) {
    if (node.dataset.assetDone) continue;
    node.dataset.assetDone = "1";
    const path = node.dataset.asset;
    if (node.tagName === "IMG") holdAssetBox(node, (V.space || "") + "|" + path);
    assetURL(path).then(url => {
      if (!url) {
        // The line says what is missing rather than showing a broken picture:
        // the file may simply not have synced to this machine yet.
        node.replaceWith(el("span", {class: "asset-missing", title: "Not in this folder: " + path},
                            "\u2298 " + path.split("/").pop()));
        return;
      }
      if (node.tagName === "IMG" || node.tagName === "IFRAME") node.src = url;
      else {
        node.href = url; node.target = "_blank"; node.rel = "noopener";
        node.download = path.split("/").pop();
      }
    }).catch(() => {});
  }
}
