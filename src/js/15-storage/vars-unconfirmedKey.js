/* Paths a full mirror holds that the server has not acknowledged. Without this
   the mirror cannot tell a page another device deleted from a page whose own
   upload failed, and guessing either way is wrong: guess "deleted" and unsent
   work vanishes, guess "unsent" and deletions come back forever. */
const unconfirmedKey = rec => "unconfirmed:" + rec.name;
