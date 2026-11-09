async function openPdfTab(path) {
  const url = await assetURL(path);
  if (!url) { notify("Attachment is missing: " + path, "warn"); return; }
  window.open(url, "_blank", "noopener");
}
