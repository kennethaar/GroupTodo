# Changelog

The version is `APP_VERSION` near the top of `grouptodo.html`, and it is shown
beside the name, top left. Every change that is pushed raises it: the last
number for a fix, the middle one for a feature, the first one for a change
that breaks existing vaults. Newest first.

## 1.11.4 - 2026-10-29

- Phones that open folders (#179). Chrome on Android has done so since
  version 132, so the help, README and Vault & sync stop saying phones
  cannot. The phone's Send button and its reminders now show on a phone
  whose area has no folder and no linked vault file; they had vanished on
  Chrome 132, even for a phone that still needs the vault file. A phone on
  a folder is not asked to move a file at the start or end of the workday.

## 1.11.3 - 2026-10-29

- The app is on GitHub Pages (#178), at
  https://kennethaar.github.io/GroupTodo/, so it opens and installs from a
  link with no download and no serve.py. Every push to main publishes it.

## 1.11.2 - 2026-10-29

- Prices on a project read right (#176). A sum is written the way its
  currency is at home, DKK 15.000 and USD 15,000, not with the browser's
  language, which gave a narrow space. A minus or brackets make a price
  negative, DKK -15000 or DKK (15000), so a refund takes off the total. The
  Cost heading on a project now says spent / planned instead of repeating
  the spent sum, and a new help topic, Prices and cost, explains both.

## 1.11.1 - 2026-10-29

- The line menu scrolls on a phone (#175). With the on-screen keyboard up
  it ran on under the keyboard, so its lower rows could not be reached. It
  now stops above the keyboard and the toolbar and scrolls inside, and a
  swipe in it no longer scrolls the page behind.

## 1.11.0 - 2026-10-29

- Help is now short topics with contents and search (#171). Search knows
  everyday words, so "delegate" finds Waiting for and "recurring" finds
  repeats. There is a topic for every view and sub-view, in sidebar order,
  plus topics on writing a line, storage, keys and what's new. Each topic is
  one screen: what it is, the steps, the keys, a picture of the screen, and a
  More fold. Back and forward move between topics, and `[[go/help-<topic>]]`
  links to one.
- ? explains the page you are on (#171). It opens This page at the right:
  what the page is for, what you can do, what you see, and where to read
  more. It follows you as you change view. Read beside opens any topic there.
- Show me (s, or the button in This page) puts numbers on the screen that
  match the legend (#171). Click a number, or the thing itself, to hear what
  it is. Esc turns it off.
- A one-line note on each screen the first time you open it, on this device
  (#171). Settings › Help turns them off. The line-menu and folding choices
  that sat in the old help panel moved there too. An ⓘ beside the Sort menu
  says what urgency is.

## 1.10.3 - 2026-10-29

- The regression battery runs in a Claude Code cloud session (#173). With no
  Edge or Chrome installed it uses the Chromium that Playwright installed, and
  as root it starts the browser without its sandbox, which Chromium needs there.

## 1.10.2 - 2026-10-29

- The regression battery starts its browser as a desktop with a mouse (#160).
  A headless browser with no mouse plugged in reads as a touch screen, where
  `+ tracker` is always shown, so the test that it waits for the pointer
  failed on such machines although the app was right.

## 1.10.1 - 2026-10-29

- On a phone, Enter brings the new line to the middle of what the keyboard
  and the line toolbar leave visible (#172), instead of leaving it at the
  bottom edge or under the keyboard. While you write there is room under the
  page, so the last line can come up to the middle too.

## 1.10.0 - 2026-10-29

- A photo from the line toolbar is shrunk before it is kept (#170): at most
  1600 px on its longer side, as a JPEG, a few hundred KB instead of several
  MB. A picture already small, or one the browser cannot draw, is kept as it
  came.
- The vault file carries the pictures the pages link to (#170), base64 below
  the pages, so a photo taken on a phone shows on the computer too. From a
  phone it holds every picture; from a computer only the last month's.
  Opening or syncing a vault file keeps the pictures this device lacks.

## 1.9.0 - 2026-10-29

- The line toolbar keeps your place (#170): after moving, indenting or
  changing a line, the page no longer jumps to the top. The line stays where
  it was on the screen and the caret stays in it, so a phone keeps its
  keyboard up.
- The line toolbar can add a picture (#170): Photo opens the camera on a
  phone, Image picks one or more pictures already taken. They are saved in
  assets/, as a dropped file is, and linked in the line.

## 1.8.0 - 2026-10-29

- While you write a line, a toolbar sits at the foot of the screen (#170):
  move the line up or down, outdent or indent it, and make it a task (or back
  to a note), a zettel, a project or a responsibility. It does what the keys
  do, for a phone that has no Tab or Alt, and rides above the on-screen
  keyboard. Pressing a button keeps the caret in the line.

## 1.7.3 - 2026-10-29

- Linked References no longer squeeze a line to one word wide on a phone
  (#169). The page a link sits on is a quiet eyebrow over its lines, which
  get the card's whole width on any screen.

## 1.7.2 - 2026-10-29

- On a phone the top bar no longer squeezes the Add a task field to a sliver
  or clips the meeting's time (#168). The first row is the menu, the capture
  field, search, help and areas; the meeting on now and your @context get a
  row of their own under it, in full, and only when there is one.

## 1.7.1 - 2026-10-29

- On a project card the next action has the lightning bolt and the
  organisations the office building, the same as in the sidebar (#167).

## 1.7.0 - 2026-10-29

- A project card in the Projects list reads in one glance (#167). The name
  comes first; under it one row with the responsibility and "4 open • 55
  done", and the progress bar right under that row with its percentage. What
  is set on the project is a line each: 🏢 organisations, ⚡ the next action,
  ✓ done when, 📅 Due and the date. The people are the faces at the foot,
  beside a View tasks button, no longer a clipped list of names. Nothing is
  said twice: the area and the organisations were a chip and a field both.
  The fields still to fill in, and the urgency score, show on hover or focus.

## 1.6.0 - 2026-10-29

- The Projects list fits a phone (#166). Search, a Filter button and a Sort
  button share one row, the search with a magnifier; area and organisation,
  and the order, open in a sheet from the bottom, and the Filter button says
  how many are on. The statuses are one row that scrolls sideways. The view
  is a "List ▾" dropdown beside the title, on every screen that has one. New
  project is a round button at the bottom right, the look-alikes a tinted
  banner you can put away until their number changes, and the subtitle is
  gone. A wide screen keeps its chips and dropdowns, now with the magnifier.
- A stray "null" no longer shows above the projects list (#166).

## 1.5.0 - 2026-10-29

- Ask for an update can leave the projects out (#161): "Name the projects
  in what they get", on as before, and remembered. Off, the email, the
  plain text and the sheet name no project, only the lines.
- Personalize text is the text of the email too (#162). The Update note and
  the Inform note have Email: parts, in the email's own words, and the email
  reads them; the other parts stay the plain text's. A note made before
  gets the Email: parts the next time you edit it.
- "Powered by GroupToDo" in the email is in English in every language
  (#163).
- An area kept in a folder that opens without it says so (#164). When the
  browser no longer has the folder at all, it asks you to pick it again,
  at start and when you switch to the area, and the sync status reads
  "folder not connected" rather than looking empty. Picking the same folder
  again is a reconnect: no more "Bring the pages along?" naming one folder
  twice.

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
