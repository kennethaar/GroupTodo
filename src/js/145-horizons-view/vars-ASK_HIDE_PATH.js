/* ---------- Hide names (#345) ----------
   Let AI write it sends your notes and the project page to an AI outside.
   The names in them need not go: people, organisations, email addresses and
   phone numbers become [P1], [O1], [E1] and [T1] in the prompt, and the
   answer gets them back before anything is saved. It is pseudonymising, not
   anonymising: what the work is about still goes along. The key between a
   token and its name lives only in the dialog, never in the vault.

   People and organisations the app knows from their pages. Anything else
   worth hiding, a product or a customer without a page, goes in 8/Hidden
   names.md, one name a line. */
const ASK_HIDE_PATH = join(DIRS.lists, "Hidden names.md");
const ASK_HIDE_NOTE = "Names are hidden: people as [P1], organisations and other names as [O1], " +
  "email addresses as [E1], phone numbers as [T1]. Keep them exactly as they are, brackets included.\n\n";
// Words the prompt itself is made of, never offered as names to hide.
const ASK_HIDE_PLAIN = new Set(["TODO", "WAIT", "DONE", "DOING", "NEXT", "NOW", "LATER", "HOLD", "CANCELLED", "SOMEDAY",
  "PROJECT", "PAGES", "ITEMS", "Project", "Task", "On", "My", "Question", "Summary", "Why", "Same", "Names", "Keep", "I"]);
