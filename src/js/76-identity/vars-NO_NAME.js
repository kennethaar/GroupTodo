/* ============================================================
   76_IDENTITY
   A shared space means several people editing the same markdown. Changes
   therefore carry a name and a time, written into the files themselves so
   they survive sync, git and any editor -- not held in some private database.

   The name lives on this device (and can differ per space: your full name at
   work, something shorter at home). With no name set, nothing is stamped, so
   a vault you use alone stays clean.
   ============================================================ */
/* The welcome screen answers this once for the device; Vault & sync and the
   coach answer it per space. Emptying a space's own field therefore has to say
   something stronger than "unanswered", or the device name comes straight back
   as a fallback and the app goes on stamping a name it just said it had
   cleared. This is that stronger answer, and it is never shown. */
const NO_NAME = "\u2014";
