/* Turned waiting with no dialog to show it in, the tip comes as a message.
   It waits a tick, so a Who are you waiting for that opens straight after
   shows it there instead; while any dialog is open it waits for next time. */
function waitTipLater() {
  setTimeout(() => {
    if (PREF.get(WAIT_TIP_PREF, "") === "1" || document.querySelector("#modalRoot .modal")) return;
    PREF.set(WAIT_TIP_PREF, "1");
    notify("Best practice for waiting tasks: " + WAIT_TIP_EXAMPLE + " " + WAIT_TIP_WHY, "info",
      {label: "Got it", run: () => {}});
  }, 0);
}
