async function bundleWithAssets() {
  await filesLoaded();                 // never a vault file of half-read pages
  const pics = await bundleAssetsMarkdown();
  return bundleMarkdown() + (pics ? "\n" + pics : "");
}
