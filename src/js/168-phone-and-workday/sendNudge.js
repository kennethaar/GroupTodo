function sendNudge() {
  if (SEND_SAID || !phoneLike() || !unsentEdits()) return;
  const at = Date.parse(PREF.get(editKey(), "") || "");
  if (!at || Date.now() - at < 10 * 60000) return;
  SEND_SAID = true;
  notify("Changes here that your PC has not got yet.", "info", {label: "Send", run: sendFromPhone});
}
