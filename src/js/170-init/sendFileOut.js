/* Returns "shared" | "saved". Never throws, and never comes back empty handed:
   whatever happens to the share sheet, the file is written. The type matters:
   a check-in sheet handed to the phone as text/markdown opens in a notes app
   instead of a browser.

   Closing the operating system's share dialog used to return "cancelled", and
   every caller read that as "say nothing, do nothing". So pressing Export, or
   Invite file, or Make the sheet on any machine with a share sheet, which is
   Chrome on Windows and every phone, could produce no file, no message and no
   sign that anything had been asked for. Somebody closing that dialog is
   almost always somebody who expected a file in their downloads, and even when
   they are not, an unwanted file in Downloads is a smaller harm than a button
   that silently does nothing. */
async function sendFileOut(name, text, type = "text/markdown", {title = name} = {}) {
  if (canShareFiles(type, name)) {
    try {
      await navigator.share({files: [new File([text], name, {type})], title});
      return "shared";
    } catch (_) {
      /* Cancelled, or an Android build that refuses files outside a user
         gesture. Either way the file still has to exist. */
    }
  }
  downloadText(name, text, type);
  return "saved";
}
