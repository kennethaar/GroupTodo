/* ============================================================
   TALKING ON A TASK
   "Done except the VAT bit" had nowhere to go: you could only edit somebody
   else's words, which loses who said what and when. A message is an ordinary
   child block carrying who wrote it and when -- so it is plain markdown, it
   nests under the task in Neovim, and because the sync merges blocks by text
   two people posting at the same moment both survive.

   A message has no state, so it is not a task: it cannot make its parent look
   unfinished and it never appears in a to-do list.

   Read is per device and never written to the vault: you reading something
   must not mark it read for everybody. A FLAG is the opposite -- it carries
   your name in the file, so it follows you between devices and your colleagues
   can see you have picked it up.
   ============================================================ */
const MSG_PROP = "msg", MSG_AT = "at", MSG_FLAG = "flagged_by";

const isMessage = b => !!trim(blockProp(b, MSG_PROP) || "");
const msgAuthor = b => trim(blockProp(b, MSG_PROP) || "");
const msgAt     = b => trim(blockProp(b, MSG_AT) || "");
const msgKey    = b => slugPerson(msgAuthor(b)) + "|" + msgAt(b);

const msgFlags = b => (trim(blockProp(b, MSG_FLAG) || "")
  .split(",").map(trim).filter(Boolean));
const flaggedByMe = b => msgFlags(b).some(n => samePerson(n, whoAmI()));
