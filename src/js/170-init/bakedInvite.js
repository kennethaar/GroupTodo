/* Opened with GroupToDo from a file manager (manifest file_handlers). */
/* A copy of the app that was baked with a space inside it. The payload sits in
   a script tag the browser never executes, so it is data and nothing more. */
function bakedInvite() {
  const node = document.querySelector('script[type="application/x-gtd-invite"]');
  if (!node) return null;
  try {
    const data = JSON.parse(node.textContent || "{}");
    return (data && data.cfg && data.vault) ? data : null;
  } catch (_) { return null; }
}
