/* ============================================================
   LINKS IN FROM EVERYWHERE ELSE
   "Did you correct the colours on the rollup?" is a sentence somebody types in
   Teams, in an email, in a text. It should be able to carry the task with it.

   A link is the page's own address plus which space, which file and which
   block -- so pasting it anywhere gives a colleague a way back to the exact
   thing. Block ids are regenerated on every parse, so copying a link stamps a
   durable id:: on that block; it is the only moment we need one, and it goes
   into the markdown like everything else.

   Links are worth most when the app is served from a URL, since then everybody
   has the same address. From a downloaded file the link still works for anyone
   whose copy sits at the same path, and the dialog says so rather than
   pretending.
   ============================================================ */
const LINK_TAG = "gt";
