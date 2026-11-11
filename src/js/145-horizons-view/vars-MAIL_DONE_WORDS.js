/* A reply to the mail: the reference line lists the tasks in order, so the
   number is the task. "2: words" or "re 2 words" is about task 2, "2 done"
   says it is done, words above the -- of a clicked reply belong to the task
   its footer names, and Got it, or a plain ok or thanks, is Got it for all
   of them. Anything else is kept as loose, for you to place. Gives null when
   the text is not such a reply, so the older formats are read as before. */
const MAIL_DONE_WORDS = "done|ok|okay|✓|ja|yes|klar|klart|ferdig|færdig|fertig|erledigt";
// A plain thanks or ok, which is Got it, in the mail and in a Teams reply.
const MAIL_THANKS_RE = /^(?:ok|okay|got it|got it, thanks|thanks|thank you|takk|tack|tak|danke|cheers|mottatt|uppfattat|modtaget|erhalten)[,.!\s\w]{0,8}$/i;
