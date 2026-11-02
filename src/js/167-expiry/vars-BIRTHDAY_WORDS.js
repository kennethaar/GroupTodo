/* ============================================================
   167_EXPIRY -- Taskwarrior's until:, and birthdays that have been
   A task with a date of its own to stop mattering says so on the task:

     until:: [[2026-11-01]]   after that day it is cancelled.
                              "Buy tickets until:fri" in the box at the top writes it.

   Nothing else is cancelled for being late. Late is a question for the weekly
   review, not for a rule that does not know why the task slipped.

   The one exception is a task for somebody's birthday: "Buy a present for
   Anna's birthday [[p/Anna Berg]]" means nothing the day after, so once the
   birthday it was written for has passed it goes. It is a birthday task when
   it (or a line above it) links a person whose page has birthday::, and its
   words say birthday -- linking Anna alone is not enough, or "Send Anna the
   contract" would vanish on her birthday. The birthday it was for is the
   first one on or after the day it was added. One switch in Vault & sync
   covers every area, kept on this device.

   Cancelled, not deleted: the task stays where it was, struck out, with
   expired:: saying when, and one toast offers to put the lot back. Put back,
   a task is marked expire:: never, because "keep this" is an answer that has
   to outlive the next time the app opens.
   ============================================================ */
const BIRTHDAY_WORDS = /\b(birthday|bday|b-day)\b|bursdag|fødselsdag/i;
const birthdayTasksExpire = () => PREF.get("expire.birthdays", "1") !== "0";
