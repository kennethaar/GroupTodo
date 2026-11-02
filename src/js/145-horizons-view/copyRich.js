/* Formatted text on the clipboard: the copy event carries text/html beside
   text/plain, which is what a mail program reads on a paste, and it works in
   a page opened from a file. The async clipboard is the second try. */
function copyRich(html, text) {
  let done = false;
  const on = e => { e.clipboardData.setData("text/html", html); e.clipboardData.setData("text/plain", text); e.preventDefault(); done = true; };
  document.addEventListener("copy", on);
  try { document.execCommand("copy"); } catch (_) {}
  document.removeEventListener("copy", on);
  if (done) return Promise.resolve(true);
  if (window.ClipboardItem && navigator.clipboard && navigator.clipboard.write)
    return navigator.clipboard.write([new ClipboardItem({"text/html": new Blob([html], {type: "text/html"}),
      "text/plain": new Blob([text], {type: "text/plain"})})]).then(() => true, () => false);
  return Promise.resolve(false);
}
