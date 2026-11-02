function installFileHandler() {
  if (!("launchQueue" in window) || typeof LaunchParams === "undefined") return;
  if (!("files" in LaunchParams.prototype)) return;
  window.launchQueue.setConsumer(async params => {
    for (const handle of params.files || []) {
      try {
        const f = await handle.getFile();
        await mergeIncomingText(await f.text(), f.name);
      } catch (_) {}
    }
  });
}
