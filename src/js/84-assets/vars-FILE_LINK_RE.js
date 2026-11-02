/* A rendered line carries the path, not a URL: the file has to be read back out
   of the folder first, and that cannot happen while the HTML is still a string.
   One pass after every redraw fills them in. */
// Attachment clicks download the stored file without entering the line editor.
document.addEventListener("click", async e => {
  const link = e.target.closest && e.target.closest("a.asset-file[data-asset]");
  if (!link) return;
  e.preventDefault();
  e.stopPropagation();
  const path = link.dataset.asset;
  try {
    const url = await assetURL(path);
    if (!url) { notify("Attachment is missing: " + path, "warn"); return; }
    const download = document.createElement("a");
    download.href = url;
    download.download = path.split("/").pop();
    document.body.appendChild(download);
    download.click();
    download.remove();
  } catch (err) {
    notify("Could not download attachment: " + (err.message || err), "warn");
  }
}, true);

/* mailto:, tel:, geo: and the Teams links hand the address to the app the
   device has for it. Taken on the way down so the line behind does not open
   for editing, and sent through location rather than a new tab: the browser
   passes the intent on and the page stays where it is. Shift-click on a
   phone number or a place does the other of calling here or the QR code. */
document.addEventListener("click", e => {
  const link = e.target.closest && e.target.closest("a.applink[href]");
  if (!link) return;
  e.preventDefault();
  e.stopPropagation();
  openAppLink(link.getAttribute("href"), e.shiftKey);
}, true);

/* A web address on a line you can edit. Edge and Chrome never follow a link
   inside contenteditable -- it only worked where the same line is drawn
   read-only, like a linked reference -- so the click opens it here. */
document.addEventListener("click", e => {
  const link = e.target.closest && e.target.closest("a[href]");
  if (!link || !(link.parentElement && link.parentElement.isContentEditable)) return;
  const href = link.getAttribute("href");
  if (!/^https?:/i.test(href)) return;
  e.preventDefault();
  e.stopPropagation();
  window.open(href, "_blank", "noopener");
}, true);

/* file:///C:%5CUsers%5C... -- a folder or document on this machine or a share,
   the way Explorer and Obsidian hand them out. A page opened as a file may
   follow it; a page served over http(s) is not let near the disk by any
   browser, so there the path goes to the clipboard, ready for Explorer's
   address bar or Win+R. */
const FILE_LINK_RE = /^file:/i;
