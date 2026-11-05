/* Which of RUN_WAYS this copy is running as, or null for one the chooser does
   not know (a company intranet, the demo). */
function runWayNow() {
  if (location.protocol === "file:") return "file";
  if (UPDATE_HOSTED) return "pages";
  if (SERVER_BASE) return "vault";
  if (CAP.served && /^(localhost|127\.0\.0\.1)$/.test(location.hostname)) return "serve";
  return null;
}
