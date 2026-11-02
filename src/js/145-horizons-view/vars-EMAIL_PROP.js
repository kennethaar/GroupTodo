/* ---------- asking ---------- */
/* An address lives on the person's page in each area, as email:: at the top,
   yours and theirs alike: Work mail goes to the work address and Home mail to
   the home one. The app only writes it when you type one in while asking. */
const EMAIL_PROP = "email";
const looksLikeEmail = s => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trim(s));
