/* ============================================================
   165_TIMERS
   Port of: init.lua nudge_check + schedule_context_reprompt + VimEnter
   ============================================================ */
/* ---------- the context nudge ----------
   This used to open the picker on a timer: a dialog over whatever you were in
   the middle of, with the keyboard taken off you, because the clock said five.
   A prompt nobody asked for has no business doing either. So it is a toast
   now. It says where it thinks you are and which key changes it, it leaves on
   its own, and ignoring it is a complete answer rather than a thing to
   dismiss. The picker itself is unchanged and one key away: this only stops it
   letting itself in. */
function offerContextChange(label) {
  const now = state.context ? "@" + state.context : "no context set";
  notify((label ? label + ": " : "") + "still " + now + "? Press @@ to change.",
    "info", {label: "Change", run: () => openContextPicker("Where are you now?", surfaceContext)});
}
