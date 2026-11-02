/* ---------- moving the bundle in and out ---------- */
async function saveBundleAsDownload() {
  const name = bundleName();
  const how = await sendMarkdownOut(name, await bundleWithAssets(),
    {title: (Spaces.active || "GroupToDo") + " vault"});
  setSetting("last_sync", nowStamp());
  markSent();
  syncSendButton();
  notify(how === "shared"
    ? "Sent " + name + ". Dropping it in a synced folder is what keeps your devices together."
    : "Saved " + name + ". Put it in a folder you share with the right people.");
}
