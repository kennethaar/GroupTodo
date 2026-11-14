/* Delete asset, from the line's menu (#391). The file goes from assets/ and
   the link from this line. Other lines keep theirs, and they stop working,
   so the warning says how many there are before anything is deleted. */
function deleteAssetPrompt(path, b) {
  const files = assetPathsOf(b);
  if (!files.length) return;
  if (!V.backend || typeof V.backend.delAsset !== "function") {
    notify("This area cannot delete files.", "warn");
    return;
  }
  const linking = asset => {
    let n = 0;
    for (const page of V.pages.values())
      for (const x of flattenBlocks(page.blocks))
        if (x !== b && [x.title, ...(x.body || [])].some(t => String(t || "").includes("](" + asset + ")"))) n++;
    return n;
  };
  const nameOf = asset => asset.split("/").pop();
  const warning = asset => {
    const n = linking(asset);
    return "Every link to " + nameOf(asset) + " will stop working. " +
      (n ? n + (n === 1 ? " other line links" : " other lines link") + " to it." : "No other line links to it.");
  };
  const run = async asset => {
    closeModal();
    try { await V.backend.delAsset(asset); }
    catch (e) { notify("Could not delete " + nameOf(asset) + ": " + (e.message || e), "warn"); return; }
    const key = (V.space || "") + "|" + asset;
    const url = ASSET_URLS.get(key);
    if (url) { try { URL.revokeObjectURL(url); } catch (_) {} ASSET_URLS.delete(key); }
    const link = new RegExp("!?\\[[^\\]]*\\]\\(" + asset.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\)", "g");
    const strip = t => String(t || "").replace(link, "").replace(/ {2,}/g, " ").trim();
    b.title = strip(b.title);
    if (b.body) b.body = b.body.map(line => link.test(line) ? strip(line) : line);
    touch(path); render();
    notify(nameOf(asset) + " is deleted.");
  };
  const del = asset => el("button", {class: "btn danger", onclick: () => run(asset)}, "Delete " + nameOf(asset));
  const text = s => el("p", {style: "color:var(--fg2);font-size:13.5px;line-height:1.55;margin:0 0 10px"}, s);
  const one = files.length === 1;
  modal({
    center: true, title: one ? "Delete " + nameOf(files[0]) + "?" : "Delete an asset?",
    body: el("div", {}, ...(one ? [text(warning(files[0]))]
      : files.map(a => el("div", {style: "margin-bottom:12px"}, text(warning(a)), del(a))))),
    foot: [
      el("button", {class: "btn ghost", onclick: closeModal}, "Cancel"),
      el("div", {style: "flex:1"}),
      one ? del(files[0]) : null,
    ],
  });
}
