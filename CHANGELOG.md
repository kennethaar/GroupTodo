# Changelog

The version is `APP_VERSION` near the top of `grouptodo.html`, and it is shown
beside the name, top left. Every change that is pushed raises it: the last
number for a fix, the middle one for a feature, the first one for a change
that breaks existing vaults. Newest first.

## 1.4.1 - 2026-10-29

- The Journal's tabs, finished by the design principles (#160). Due Today &
  Late always shows open beside done, with its bar, "3 open · 0 done · 1
  late", not a bare red 3 until the first thing is done; late is the one
  word in colour. Next 7 Days and @context say "2 open", and an empty list
  shows no 0. A day with no trackers says "Nothing tracked yet." and its
  + tracker waits until you point at it, like the other upkeep. Calendars ·
  add a link, Edit Markdown, the pin and + tracker are faded rather than
  hidden while they wait, so Tab lands on them and shows them.

## 1.4.0 - 2026-10-29

- The Journal is about doing (#160), by the design principles now in
  CLAUDE.md. A row under Due today & late, Next 7 days or @context reads in
  the order you act: the project as a quiet line above, which is the
  project's pill again when you point at it, then the state, the context
  and the words, with the row's ⋯ at the end of them. A context written
  inside the sentence stays where it is. Dates say what they are, "Due
  yesterday", and under Due today a row due today with no time shows no
  date. The Due tab shows a bar and "2 open · 1 done · 1 late", and the
  list ends in "1 done today", which opens to those rows. Trackers shows no
  0. Calendars · add a link (with no calendar linked), Edit Markdown, the
  pin and another + tracker wait until you point at them or tab to them,
  and are always shown on a touch screen.
- On the day page in the Journal, a task's context at the end of the line
  is drawn in front of its words, as a pill; the file keeps it where it
  was. Each line's ⋯ is shown. Each journal keeps its coloured area badge,
  and its title is just Journal.

## 1.3.1 - 2026-10-29

- The update mail (#159): a task linking an email ([[m/...]]) now shows the
  email's subject without the m/, and a question with the person's name taken
  out no longer reads "svar fra om ...": the fra goes with the name.

## 1.3.0 - 2026-10-29

- The update mail (#159), for Send an update and Ask for an update alike.
  Write the email, then Copy and open email: the mail goes on the clipboard
  as formatted text and a new mail opens with To and Subject filled in and a
  line saying where to paste, above your own signature. Each line is
  numbered, with its status and your word on it, and links that open a short
  reply to you: Ask about this, ✓ Mark as done, Write about this, Answer
  this, and ✓ Got it, thanks for the whole mail. A reply typed by hand works
  the same way, "1 done" or "2: next week". Paste a reply reads both, stamps
  `acknowledged::` for Got it, closes only what you asked about, and asks
  which task words with no number are about. Built to survive a paste into
  Outlook and Gmail, dark mode included. Copy text, Plain-text mail and the
  sheet are still there. Mockup in docs/update-mail-mockup.html.

## 1.2.0 - 2026-10-29

- Stakeholders on responsibilities (#158): `stakeholder::` on a
  responsibility's page, people or organisations, picked with + stakeholder.
  Send {name} an update then has a summary of each project under the
  responsibilities they follow: status, next action, done since they were last
  told, late and waiting. Sending stamps `told::` and logs the update under
  Updates sent on the responsibility's page. Their page says what they follow
  and how often they want to hear (`update_every::`, monthly unless set);
  when that has passed, a nudge, Waiting for and the weekly review say so.
  Notify on a finished project offers them too. An organisation stakeholder is
  not a client of the projects.

## 1.1.0 - 2026-10-29

- Send an update (#153): the check-in sheet the other way round, for your own
  tasks somebody is waiting to hear about. `/inform` on a line, Alt+U, the
  line menu, the side panel, or Send … an update on a person's or
  organisation's page. Each line goes with a status and a comment, in the mail
  or as a read-only sheet. Sent lines get `informed::`, a "Told …" line in
  their chat, and a changed status can go to the task. Waiting for shows
  "told Nd ago" beside "asked Nd ago". Wording in Settings → Inform note.

## 1.0.0 - 2026-10-29

- Version numbers: shown beside GroupToDo, top left.
- A regression battery: `node tests/run.mjs` (or double-click `tests/run.cmd`).
