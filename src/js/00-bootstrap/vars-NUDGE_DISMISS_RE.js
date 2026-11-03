/* A reminder the app thought of, rather than one you asked for, so it waits in
   the corner instead of taking the screen. It takes the same shape as modal()
   -- title, hint, body, footer buttons -- but drops the "later" kind of button,
   because ignoring a toast already is "later". It goes on its own after 15s,
   or with stay, when its cross is clicked: news you would not want to miss
   because you looked away. kind is a class, so a newer one can replace it. */
const NUDGE_DISMISS_RE = /^(later|not now|not yet|cancel|close|skip|stay here)$/i;
