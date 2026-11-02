/* ---------- a server space is shared, so it has to be re-read ----------
   Two devices on one serve.py write to the same vault, but nothing told either
   of them to look again, so each sat on the copy it loaded and the other's work
   only turned up after a reload. Coming back to the app is the moment to check.

   Order matters: send ours up first, and only re-read if that succeeded. The
   server is then authoritative for everything, deletions included, so a plain
   re-read is safe. If the send failed the server is behind us, and overwriting
   our pages with its older ones would be the one unforgivable move -- so we
   leave well alone and try again next time. */
let SERVER_READ_AT = 0;
