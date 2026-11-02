async function linkVaultFile() {
  if (!CAP.savePicker) { notify("This browser cannot link a file. Use Save / Open instead.", "warn"); return; }
  try {
    const opts = {
      suggestedName: bundleName(),
      id: "gtd-vault-" + Spaces.active,
      types: [{description: "Markdown", accept: {"text/markdown": [".md"]}}],
    };
    const near = LINKED || await storedHandle(Spaces.active).catch(() => null);
    if (near) opts.startIn = near;     // the save dialog opens where it was last
    const h = await window.showSaveFilePicker(opts);
    LINKED = h;
    await IDB.set("kv", "bundle:" + Spaces.active, h).catch(() => {});
    await syncLinked();
  } catch (e) {
    if (e.name !== "AbortError") notify("Could not link file: " + e.message, "error");
  }
}
