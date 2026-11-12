# Changelog

The version is `APP_VERSION` near the top of `grouptodo.html`, and it is shown
beside the name, top left. Every change that is pushed raises it: the last
number for a fix, the middle one for a feature, the first one for a change
that breaks existing vaults. Newest first.

## 1.155.1 - 2026-11-12

- Hold and until: a task for a birthday is no longer cancelled once the
  birthday has passed. Only an until:: date cancels a task. The Past birthday
  tasks setting is gone (#381).

## 1.155.0 - 2026-11-12

- Next › List: Focus, once one context is picked. Only its first next action
  is shown, in the list's own order, and nothing else. Done (Enter) ticks it
  and brings the next one. Skip (→) leaves it as it is. When none are left,
  you can go through the skipped ones again. Esc leaves (#360).

## 1.154.1 - 2026-11-12

- Keys on a line: write ``` on a line, then go on with Shift+Enter, and the
  lines under it are drawn in the fixed-width font, in the Journal too.
  Before, only a fence that began under the line counted (#374).

## 1.154.0 - 2026-11-12

- Weekly review › Clarify: the card says plainly what the line is already.
  Every link and #tag has its kind, a responsibility, note or plain page
  too. A line that is only links or tags says it is on file already. A
  person, organisation or project written without a link is shown with Link
  it, which links it to the page you have, in any case (#379).

## 1.153.2 - 2026-11-12

- Weekly review › Projects: a card that got every question answered after it
  was dealt, on its page for example, is passed by. It no longer waits with
  only Next card on it (#378).

## 1.153.1 - 2026-11-12

- Weekly review › Projects: None, Just me and No deadline are written on the
  project (org:: none, with:: none, deadline:: none), as Nothing comes first
  already was. Before, they were kept for the week only, so every project
  without a deadline or a team was asked again each week. Adding someone
  later takes the place of none (#377).

## 1.153.0 - 2026-11-12

- Weekly review › Clarify: the line's day page sits on the right, the line
  marked in the middle and the rest quiet, as in Focus. Scroll it to see
  what came before and after. It follows each new line. Close puts it away;
  Show the day page beside it brings it back (#376).

## 1.152.1 - 2026-11-12

- Weekly review › Clarify: a markdown table reads as a table, on the card
  and in the lines under it, not as raw | rows (#375).

## 1.152.0 - 2026-11-12

- Keys on a line: a sketch drawn in characters, pasted under a line after
  Shift+Enter, keeps its lines and spaces in a fixed-width font. The file
  holds it between ``` lines, so it reads the same in any editor (#374).

## 1.151.1 - 2026-11-12

- Waiting for › List: a task's panel has Paste a reply beside Ask for an
  update, so their answer comes back where you asked (#370).

## 1.151.0 - 2026-11-12

- Waiting for › List: Paste a reply now takes a reply with no reference in
  it. You say who it is from, then pick what it answers from their
  waiting-fors, your questions to them and their projects. Search everything
  finds any other open task. Every step has Back (#373).

## 1.150.0 - 2026-11-12

- Waiting for › List: one task per row, with how long it has waited. Paste
  a reply and Export sit by the title. One choice shows All, Overdue, Not
  asked yet or a stage such as Ordered, each with its count. Each person has
  a heading with how many, and tasks with nobody named are under Unassigned
  (#372).
- Ask for an update: the note reads as the message. Who it goes to is under
  the title, with Edit. The language is a choice beside it. The subject has
  its own field. The tracking IDs are kept out of the message and added when
  it goes. Change the message and you can tick Update the task text with my
  edits. Copy text, Send in Teams and Open in Email are the three ways to
  send it (#372).

## 1.149.3 - 2026-11-12

- Projects › List: one list, one project per row, on a wide screen too.
  It no longer flows into columns side by side (#371).

## 1.149.2 - 2026-11-12

- Waiting for › List: a reply on a task says who wrote it and when, for
  example `Ariol · Today 14:05`, instead of reading like your own note. The
  person chip on a waiting task now offers Paste a reply too (#370).

## 1.149.1 - 2026-11-12

- States and Waiting for: Alt+1 on a line you are editing turns its words
  into the project link once. A name with a sign a file name cannot hold,
  such as `Plan: shed`, no longer stays in front of its own link (#369).

## 1.149.0 - 2026-11-12

- States and Waiting for: when a line becomes a project, by Alt+1, the
  line menu or Clarify, each step shows From your notes. That is the
  lines it is written under, the line, and the lines under it, so the
  meeting notes are not hidden behind the dialog. The line's own words
  are still the first name offered.

## 1.148.0 - 2026-11-12

- Weekly review › Clarify: under the line, chips say what it already
  names, such as Person: Kari or Project: Kitchen. Mark words… turns words
  on the line into a person, organisation, context or project link where
  they stand. Select the words first, or type them. The line stays on the
  table for its answer.

## 1.147.0 - 2026-11-12

- Weekly review › Clarify: a line with lines under it, such as meeting
  notes, offers Leave it and the lines under it as notes. One click
  answers them all. Lines one level further down are still asked about
  one by one, and Undo that takes it back.

## 1.146.1 - 2026-11-12

- Weekly review › Clarify: above the line it says what your last answer
  did, such as Last: “Order tiles” → To do, with Undo that. Undo that, or
  Backspace, takes answers back one at a time, not only the last one, so
  a line clarified wrongly a few lines ago can be fixed.

## 1.146.0 - 2026-11-12

- Vault and sync: copying pages into a folder shows a bar, how many are
  done, and how many the folder already had and kept. At the end it says
  how many projects and tasks are there, with Save log. If the folder
  stops answering, a box says so: your work is in this browser for now
  and nothing is lost. A log of what happened is saved to your downloads
  by itself, and Try the folder again tries at once.

## 1.145.2 - 2026-11-12

- Waiting for › List: Ask for an update has one main button, Write the
  message, beside Cancel. Make the sheet is gone: the mail has a reply link
  on each line. Let AI write the questions, Send as and Name the projects
  fold under More. Paste a reply and Import a file sit apart, under Got an
  answer?. The note has Back, which returns to the lines still ticked.

## 1.145.1 - 2026-11-12

- Waiting for › List: a task or a Waiting for indented under a line that
  links a project now belongs to that project. This works for a link
  written as [[Project]] and on any page, not only day pages. The project
  counts the line, and Ask for an update lists the lines under their
  project instead of the page they are on.

## 1.145.0 - 2026-11-12

- Journal: the Feedback review names each outcome by what you want. A
  to-do offers Done, Keep it, Someday/Maybe and Cancelled. Something you
  wait for offers Keep waiting and Take it back, which makes it your own
  to-do again. The button under the edit repeats your choice, such as
  Keep waiting and next.

## 1.144.0 - 2026-11-11

- Projects › Hours: Clients now shows Not yet billed, one row per client
  with the time and priced done tasks you have not billed. Bill lists them
  up to a day, priced at rate:: on the project or organisation. Mark
  billed and copy pastes the lines into your invoice program, and
  remembers what was billed, so nothing is billed twice or forgotten. The
  payment becomes a Waiting for, shown under Waiting for payment until
  you tick it.

## 1.143.3 - 2026-11-11

- Phone and PC: in Vault & sync, Phone sync is now Use on phone. It says
  what really happens. Create file… makes one file with your lists. Save
  it in OneDrive, Dropbox or a folder the phone also sees, then import it
  on the phone with Import files. Once made, the row shows the file's name
  and Sync now.

## 1.143.2 - 2026-11-11

- Getting started: selecting text in a dialog no longer closes it when
  you let go outside the dialog. Only a click on the dim area around it
  closes it, so typed text is not lost.

## 1.143.1 - 2026-11-11

- Areas and sharing: the app now says why a server folder helps. Run
  serve.py on a PC that is always on. Other phones and PCs then open
  GroupToDo at that PC's network address and use the same area, with
  nothing to set up on each one. It no longer says a phone can't open
  folders. Chrome and Edge on a phone can, but only its own folders.

## 1.143.0 - 2026-11-11

- Areas and sharing: serve.py can now hold one folder for each area. Add or
  remove them at the bottom of "Manage areas". Press "Use server folder" to
  put an area in a free one. If serve.py has no folder yet, it asks for one
  when it starts and tells you why. Type x to stop it asking. Each time it
  starts, the app lists the folders, the area in each, and what else
  serve.py can do.

## 1.142.2 - 2026-11-11

- Areas and sharing: serve.py no longer picks a folder by itself, on a PC
  or a phone. It only uses a folder you pick in the app, or one you name
  with --vault when you start it.

## 1.142.1 - 2026-11-11

- Areas and sharing: when you open GroupToDo from serve.py at a new
  address, no area goes into the server folder until you say so. "I have
  used GroupToDo before" now shows "Use server folder" next to "Choose a
  folder", and skips the guide for new users. On a PC, serve.py no longer
  uses the old OrgMode folder by itself.

## 1.142.0 - 2026-11-11

- Areas and sharing: when the app runs from serve.py, the bottom of "Manage
  areas" shows the folder serve.py uses. "Choose folder" or "Change folder"
  lets you pick it on this PC, and serve.py keeps your pick for next time.
  "Remove" forgets it. Each area has "Use server folder" to move it there.

## 1.141.2 - 2026-11-11

- Ways to run GroupToDo: serve.py's address is a name now,
  http://grouptodo.localhost:8777. Your browser keeps areas per address, so
  the first time there you choose your folders again. 127.0.0.1:8777 still
  works.

## 1.141.1 - 2026-11-11

- Ways to run GroupToDo: serve.py's start box says Server folder, not Vault.
  It is one folder, not your areas. The line below says how to put an area
  in it: Vault & sync › Advanced › Sync server.

## 1.141.0 - 2026-11-11

- Ways to run GroupToDo: serve.py starts with a box that says where to go
  and where the log is. Request lines go to grouptodo.log in Downloads,
  which keeps 500 lines. Errors still show in the window. A calendar link
  shows only its first 15 and last 5 characters, since it works like a
  password.

## 1.140.4 - 2026-11-11

- Waiting for › List: the Send an update note also ends with the lines, not
  Thanks and your name. An ending you write under Personalize text still
  goes in.

## 1.140.3 - 2026-11-11

- Waiting for › List: the Ask for an update note ends with the lines, not
  Thanks and your name, since your mail adds your signature. An ending you
  write under Personalize text still goes in.

## 1.140.2 - 2026-11-11

- Waiting for › List: when you last asked and what they last said goes in
  the ask only when you tick it, so a wrong date does not go out by itself.
  Norwegian says ikke svart ennå.

## 1.140.1 - 2026-11-11

- Waiting for › List: on a PC, Send in Teams opens the Teams app instead of
  a browser tab, so it finds people outside your company too. The message is
  ready in the chat, and on the clipboard too: if Teams drops it, press
  Ctrl+V. A phone keeps the web link. An address written as mailto://...
  works as a plain address.

## 1.140.0 - 2026-11-11

- Waiting for › List: a task's panel has Ask for an update beside Send an
  update when the line names someone. Both dialogs say Write the message,
  since it goes by email or Teams, and the Ask dialog has one scroll bar.

## 1.139.1 - 2026-11-11

- Waiting for › List: a Teams message about one task has no number in front
  of it, and in Norwegian the line under it starts with Angående:.

## 1.139.0 - 2026-11-11

- Waiting for › List: Send in Teams works as a chat. The message has no mail
  links; each task ends with its reference, and they reply in the chat. Select
  your message and their reply, copy them, and use Paste a reply: your own
  lines are left out and each answer goes to its task, with no questions. When
  the reply goes back and forth, Paste a reply lists the lines, ticked, and
  what follows your own name starts unticked.

## 1.138.1 - 2026-11-11

- Waiting for › List: in the mail from Ask for an update and Send an update,
  a task's title is plain text again. The Answer, Mark as done or Ask about
  this link below it is the one way to reply, so the title no longer opens the
  same reply a second time.

## 1.138.0 - 2026-11-10

- Horizons: drag a responsibility onto another area to move it there. The
  move asks first and offers the projects under that responsibility, ticked,
  so they come along unless you untick them. Moving a responsibility page with
  Alt+S offers them the same way. (#349)

## 1.137.0 - 2026-11-10

- Keys on a line: lines read Obsidian's formatting: **bold** and __bold__,
  *italics* and _italics_, ==highlight== and ~~strike~~. The marks * _ ` " and
  ' come in pairs in front of a word, as brackets do; == and ~~ pair from the
  second mark. Picked words get the marks around them. Ctrl+B, Ctrl+I and
  Ctrl+Shift+H bold, italicise and highlight, and take it off again. Undo
  takes back just the pair. The verb check and plain text look past the
  marks. (#348)

## 1.136.1 - 2026-11-10

- Waiting for › List: Ask for an update fills in their address for Send in
  Teams and the email from `email::` wherever you wrote it: their page with the
  name in another case, a context of their name, or their page in another
  open area. It no longer asks for an address you already have. (#123)

## 1.136.0 - 2026-11-10

- Waiting for › List: the first time you turn a task to waiting, a short tip
  shows how to write it: `[[p/Person]]: Trenger dere et møte med oss om
  dette?`. The link files it under that person, and Ask for an update sends
  only the question. The tip shows once; it is also under More in this help
  topic. The name at the start of a waiting task is now taken out of the ask,
  as one at the end already was, also when the question names other people.
  (#347)

## 1.135.5 - 2026-11-10

- Waiting for › List: the mail that asks for an update now looks clickable only
  where it is. Each line's title is a link, and its main action is a solid
  button, Answer or Mark as done. The Question and Waiting for labels are gone;
  a quiet About: line names the project instead. (#159)

## 1.135.4 - 2026-11-10

- Phone and PC: after a reload, Allow access on the open area now asks for
  the next area's folder too. Before, the other area quietly stayed on
  browser storage, so its day pages differed from the PC's.

## 1.135.3 - 2026-11-10

- Waiting for › List: Let AI write it shows the AI the exact shape of the
  answer, each item starting with its number. If the AI still leaves the
  numbers out, the answers go on the lines in order. An edited prompt keeps
  your own words; choose The standard one to get the new one. (#344)

## 1.135.2 - 2026-11-09

- Waiting for › List: Let AI write it no longer garbles the prompt. A name
  is hidden only as a whole word, and a one-word name only with its capital,
  so a person called Per leaves "per day" alone. The answer shows the names
  again as soon as you paste it, and Who is who under the prompt says which
  token is which name. (#345)

## 1.135.1 - 2026-11-09

- Waiting for › List: Let AI write the questions opens again in a vault
  where three or more people share a first name. Before, the dialog closed
  and nothing opened. Should it ever fail to open, it now says why and
  returns to Ask for an update. (#345)

## 1.135.0 - 2026-11-09

- Waiting for › List: Let AI write it hides names before the prompt leaves.
  People, organisations, email addresses and phone numbers go as [P1], [O1],
  [E1] and [T1], and the answer gets them back before anything is saved. An
  answer with a token the prompt did not use is not saved. The prompt can be
  edited before you copy it, Hidden names in 8/ holds other names to hide,
  and words that look like names are offered to add. Hide names can be
  turned off. What the work is about still goes along. (#345)

## 1.134.1 - 2026-11-09

- Waiting for › List: Let AI write it now sends the project page with the
  prompt, once for every line on it, with the lines asked about marked, so
  the AI knows what the question is really about. Ids, dates added and
  other bookkeeping are left out, and a very long page is cut. (#344)

## 1.134.0 - 2026-11-09

- Waiting for › List: Ask for an update reads right to somebody who has
  not seen your notes. A task can carry the question to ask (ask::), a
  short summary that goes instead of the lines under it (brief::) and why
  it matters (why::). Write them once, in Who are you waiting for or with
  Add the question in the ask, and every reminder after says the same.
  Each line also says when you last asked and what they last said. Let AI
  write it copies a prompt with your notes to your own AI, for one task or
  the whole ask, and its answer fills the question and summary and leaves
  out lines that are the same topic. (#344)

## 1.133.1 - 2026-11-09

- Chores: on a phone a chore's words get the width and wrap, and its chips
  go on a line under them. The bar shows how far round it is, without a bare
  percentage. Grid, Board and Sort get a row of their own, each room is a
  full-width row, and Group by is labelled. (#343)

## 1.133.0 - 2026-11-09

- Vault and sync: Check the folder shows how long the last read of the
  folder took - the listing, the reading of the files, opening and reading
  the text apart, and the five slowest files - so a slow read on a phone can
  be traced to what takes the time.

## 1.132.2 - 2026-11-09

- Phone and PC: back in the app, today and the page that is open are read
  again from the folder. A change made on the PC and brought over by a sync
  app such as Syncthing shows at once, without opening the whole folder
  again. A page with unsaved work here is merged when it is saved (#341).

## 1.132.1 - 2026-11-09

- Vault and sync: after Allow on a phone, only pages that really changed are
  saved. A page kept in this browser waits until the folder has read its
  file, and is let go of when the folder has it. A file that already says
  the same is not written again, so a sync app such as Syncthing has nothing
  to carry. A save that stops half way goes on with what is left (#340).

## 1.132.0 - 2026-11-09

- Vault and sync: the line at the bottom of the sidebar says when it is safe
  to close: All saved to disk and the time, 1 line being typed - not saved
  yet, Saving 2 of 3 files..., or NOT on disk with how many files wait in
  this browser. Ctrl+S writes the line you are in and saves every open area
  now, and closing the tab warns for a line still being typed (#337).

## 1.131.3 - 2026-11-09

- Links and aliases: a link whose text is the page's own name is saved
  without it, so `[[p/Jane Doe][Jane Doe]]` becomes `[[p/Jane Doe]]`. A
  link that reads an alias, such as JS, keeps it (#338).

## 1.131.2 - 2026-11-09

- Dates and reminders: a task due days ago says only how late it is, such
  as `6 d late`. Point at the pill or click it to see the date. Under Due
  today & late a task no longer shows how many days old it is (#336).

## 1.131.1 - 2026-11-09

- Projects › List: under Projects in the sidebar, each responsibility wears
  its area's capital letter on the area's colour (#330).

## 1.131.0 - 2026-11-09

- Links and aliases: select words, then Tag › Person, Organisation or Context (#335).
  Making a page of the words comes first. Under it are the names they likely
  mean: by alias, by the start of a word, or spelled a little differently.
  The pick links the words where they stand, so "JT" reads JT and goes to Jonas.

## 1.130.0 - 2026-11-09

- Hold and until: On hold is in the state menu, next to Waiting for (#334).
  Right-click or long-press a task's state, or use its ⋯, and pick On hold.
  It asks for the day it comes back, or No date.
  A task type's stage can count as on hold too: write "Paused (on hold)".

## 1.129.1 - 2026-11-09

- Links and aliases: a project name inside a Windows path stays part of the path (#333).
  "C:\...\Nordic Lights\Meetings\..." no longer turns the folder into a link
  to the project, quoted or not.

## 1.129.0 - 2026-11-09

- A page: a PDF in a line can be read where it is (#331). The caret beside
  its paperclip shows it under the line, and folds it away again; this
  device remembers which. Written ![name](file.pdf), as Obsidian does, it
  shows from the start. Full size opens it over the page, Download saves
  it. A browser that cannot show a PDF in a page offers a new tab instead.
  Another file written with ! is now a paperclip link, not a broken picture.

## 1.128.0 - 2026-11-09

- Links and aliases: a file path in quotes, as Explorer's Copy as path gives
  it, is a link. It shows only the file name; hover for the whole path, and
  edit the line to change it. Click it to open the file (#333).

## 1.127.1 - 2026-11-09

- Journal: Hide done is now one switch for every day page, at the top
  beside the date. It shows on every day, so it is always in the same place,
  and it hides done lines in every area at once (#332).

## 1.127.0 - 2026-11-09

- Journal: a day page has a Hide done switch, in each area's column and when
  the day is opened as a page. Done and cancelled lines go from view; the day
  page keeps every line as written. The choice is kept for every day (#332).

## 1.126.0 - 2026-11-08

- Projects › List: open Projects in the sidebar to see every area, with how
  many active projects each has. Click an area to see only its projects (#330).

## 1.125.0 - 2026-11-08

- Chores: open Chores in the sidebar to see every room, with how
  many chores are due now in each. Click a room to see only its chores (#329).

## 1.124.0 - 2026-11-08

- Waiting for › List: open Waiting for in the sidebar to see everyone you
  are waiting on, with how much each owes you. Click a person to see only
  what they owe; the Person picker shows everyone again (#328).

## 1.123.2 - 2026-11-08

- Next actions: the contexts under Next in the sidebar show only those with
  actions to do. Actions with no context gather under No context (#204).

## 1.123.1 - 2026-11-08

- Calendars: in the Journal, one click on the date opens the picker, and one
  click on an arrow changes the day (#291). Import calendar shows only while
  the calendar is open, beside the date box, so nothing moves under the
  pointer and the calendar never covers it.

## 1.123.0 - 2026-11-08

- Recipes: a recipe page in k/, numbered and in metric, for as many as you
  cook for (#327). In Pages, *+ New recipe* takes a link or the recipe's
  text and makes a prompt for your AI. Paste its answer back to get the
  page, *k/42 Lasagne*, with the next number to file a print by. The AI
  turns cups, ounces and °F into grams, litres and °C. On the recipe, set
  *Cook for* and the ingredients show for that many: 400 g for 4 is 600 g
  for 6. The page keeps the amounts it was written with.

## 1.122.0 - 2026-11-08

- States and Waiting for: a day-page line that starts with a verb can become
  a to do by itself (#326). *Call Bob about the quote* is a to do once you
  leave the line, and *Keep as note* in the toast undoes it. It is off by
  default. Turn it on per area in *Your areas*, so a book area can keep it
  off. One word, a question, a heading, an event, a quote or a line you kept
  as a note stays a note.

## 1.121.0 - 2026-11-08

- Weekly review › Reflect: each Toward or Away now says which intention it
  moved (#210). With more than one intention, a pick asks which one. Each
  intention has a score, toward adds one and away takes one, and a chart
  shows every intention's score over the weeks. An entry picked in two
  weeks counts once.

## 1.120.0 - 2026-11-08

- Events and feelings: a = line now helps you name the feeling (#214). Type
  a few letters, and the box lists the Feelings Wheel words that match, from
  any ring, each with where it sits. Pick one, and it lists the closer words
  outside it: Angry, then Let down, then Betrayed. Esc keeps the word you
  have. Edit the words in Settings, under Feelings. Any list can be a word
  list for lines of its own: kind:: words, and lines:: for their mark.
  The weekly review's Reflect counts the week's feelings by core feeling,
  such as Angry 2 · Happy 1, from the word alone.

## 1.119.0 - 2026-11-08

- Chores: Print now covers the days you pick (#325). Choose This week (today
  to Sunday) or Next week (Monday to Sunday) beside Print. Your device
  remembers the choice. The sheet's heading names the days, not a week
  number. Late chores and chores due now are always on it. A chore that is
  due more than once in those days, such as a daily one, gets a line and a
  box each time. Whose turn is shown for the first time only, unless the
  chore is handed to someone.

## 1.118.3 - 2026-11-08

- What's new: the toast that welcomes a new version, or offers one, now
  says what each new thing is (#256). Before, it showed only which part of
  the app it belongs to, such as "A page".

## 1.118.2 - 2026-11-08

- A page: the Focus teleprompter now moves smoothly (#324). Typing fast no
  longer makes the slide stop and start. The light and the growth move
  together, on one soft curve, and the text around the lit paragraph stays
  still as it grows.

## 1.118.1 - 2026-11-07

- A page: in the Focus teleprompter, the text now slides to the middle
  instead of jumping (#324). The light fades from one paragraph to the next.
  The lit paragraph grows a little larger, and the ones just above and below
  it half as much. The words keep their lines as it grows, and nothing is cut
  off at the edge.
- What's new: each new thing now starts with a bold line that says what it
  is, not only which part of the app it belongs to (#256).

## 1.118.0 - 2026-11-07

- A page: on a computer, Focus is a teleprompter (#324). The line you write
  in stays in the middle of the screen, and the text moves past it. Scroll,
  and the paragraph in the middle lights up while the rest step back. On a
  phone, Focus stays as it was.

## 1.117.0 - 2026-11-07

- A page: Focus is on every page now, not only a book's chapters (#323).
  It sits beside the title, and in the Journal beside History. Focus hides
  the sidebar, the bar and everything round the page or the day. The
  paragraph you write in stays bright. Esc or Leave focus brings it all back.

## 1.116.1 - 2026-11-07

- Writing a chapter: in Focus, the paragraph you write in stays bright and
  the others step back (#244). Linked References and the way up to the book
  go too, so only the chapter is left. Esc while you write now leaves only
  the line, not Focus.

## 1.116.0 - 2026-11-07

- Natural planning: a new step, What comes first, says which next action
  waits for another (#275). The actions are dealt one at a time onto the
  card, the others round it. Press the one that can't start until it is
  done, or 6 if nothing waits; Backspace undoes. Finish writes it under the
  action that waits for it, so Next shows only what can start.

## 1.115.3 - 2026-11-07

- A page: Linked References has its own Hide done switch (#321). Each page
  remembers its switches in hide_done::, so it opens the way you left it.
  Other pages keep their own choice.

## 1.115.2 - 2026-11-07

- A page: a project's tasks written on day pages show once, in Linked
  References, instead of twice (#322). From the day pages is gone. Tick a
  task there to mark it done; the tick does not open the day page.

## 1.115.1 - 2026-11-07

- A page: Hide done hides only the page's own done lines again (#321). Done
  tasks written on day pages and done lines in Linked References stay, as
  they were written. The count is this page's only.

## 1.115.0 - 2026-11-07

- Natural planning: Rules we play by now helps when the mind goes blank
  (#277). A card shows one prompt at a time, such as "What will we never do
  to get it done?". Draw another, or press Space in an empty box. Once there
  is a Why or Must achieve, Ask AI for 3 rules copies a prompt for your AI.
  Paste its answer back, and its rules are offered to pick: click one to
  keep it. Hide prompts hides the cards here and in Brainstorm.

## 1.114.2 - 2026-11-07

- A page: Hide done is now a switch you turn on and off (#321). It also
  hides done tasks from the day pages and done lines in Linked References,
  and its count takes them all in.

## 1.114.1 - 2026-11-07

- A page: a click on a picture opens it full size over the page, not in a
  new tab without a word (#320). ✕, Esc or a click on the picture closes it.
  Open in new tab is below it, for zooming or saving.

## 1.114.0 - 2026-11-07

- A page: Hide done above the lines shows only what is left (#321). Done
  and cancelled lines go, with the steps under them; the chip counts them.
  The choice stays on this device, so every page opens that way until you
  turn it off. It shows only on a page with something done.

## 1.113.6 - 2026-11-07

- A page: a click on a picture in a line opens the picture full size (#320).
  It used to open the line for editing instead. A click beside the picture,
  on the same line, still opens the line to write.

## 1.113.5 - 2026-11-07

- Next › List: a wide screen reads like the phone (#315). One column, each
  context with its actions under it, never split in two. A row is a round
  tick, the words, and one quiet line with the project and Due. The text
  filter stays in sight; Filter opens the states, contexts and order.

## 1.113.4 - 2026-11-07

- Repeat and routines: a repeat ticked Done, then Doing, then Done again gets
  one next occurrence, not one per tick (#313). When the next one is already
  on its day, Again? does not ask again and says "Next one is already on
  <date>". Ticking in Chores no longer adds a second one either.

## 1.113.3 - 2026-11-07

- A task's panel says words, not how the file stores them (#317). The top
  names the page or the journal day, not its file. The title reads like the
  Journal line, names and @context as words, until you click to edit it.
  Tags show the name without p/. The states read To do, Doing, Waiting, On
  hold and Done, repeats read Never, Daily, Weekly, and the dates are Starts
  and Due. An empty time field says Time instead of a time that looked set.

## 1.113.2 - 2026-11-07

- Weekly review › Steps: the way back to Projects is a quiet link above the
  title, so the switch holds only the review's own steps and "Projects" no
  longer shows twice side by side (#318). Contexts leads back to Next the
  same way.

## 1.113.1 - 2026-11-07

- Settings: in Paper, blue text such as "Open the day page", "Skip this
  line" and the pressed tab is a little darker, so it is easy to read on the
  page and on light blue (#319).

## 1.113.0 - 2026-11-07

- Next › List: actions are grouped by context, one header each with its
  count, the group with the most urgent action first (#315). Click a header
  to see only that context. A row says its context once, in its own words,
  as you typed it; the Journal shows the words only and never groups, not
  even on a phone. Typing a plain word in the capture box or on a line now
  offers the contexts it could be, beside people, organisations, projects
  and dates, and a pick becomes a link.

## 1.112.2 - 2026-11-07

- The top bar: only @ makes a context. A plain word is never read as one,
  so "Buy milk for the office" stays exactly that, instead of turning into
  @office and "Buy milk for the" (#315). The words always stay as you typed
  them, @context where you wrote it, and the context also leads the line as
  a chip in the Journal, Next and Search alike.

## 1.112.1 - 2026-11-07

- Search: each hit says where it is in words, such as Journal · Today or the
  page's title, instead of a file path (#316). The late count in the sidebar
  and the @context pill now reach AA contrast in every theme, and the Phone
  and PC help says where Send really is on a phone: the area menu.

## 1.112.0 - 2026-11-07

- Getting started: once your first task is in, a new step, Pick your next
  action, opens Next and ticks itself there (#314). Each tick is now a real
  button, so Enter and Space cross a step off. The folder step says what
  picking a folder gives. The Start writing dialog is shorter and tidier.
  The dialog reached from Vault & sync is now titled Vault & sync, and
  Working hours start at 08:00 to 16:00 on weekdays, with From and To in
  empty boxes.

## 1.111.1 - 2026-11-07

- Next: the Contexts view's two readings, lost with its sidebar entry, are
  back at the end of Next's view switch as List contexts and Sort contexts.
  Their own switch leads back to Next.

## 1.111.0 - 2026-11-06

- Next: the sidebar no longer has its own Contexts entry. Its context list
  now sits under Next, busiest first, with a None row for actions that have
  no context yet, and the Context filter in Next offers the same None
  choice (#312).

## 1.110.0 - 2026-11-06

- Waiting for › Board and Journal: the → Name pill's menu now also offers
  Take it back and Change person (#311), so handing a task to someone else
  no longer needs the task panel. Change person leads with anybody sharing
  a first or last name with who has it now, then the rest alphabetically,
  and can be filtered by typing.

## 1.109.5 - 2026-11-06

- Waiting for › Board and Journal: the → Name pill jumped straight to Ask
  for an update (#311). Clicking it now offers Open task as well, since the
  pill still sits in front of the task it names.

## 1.109.4 - 2026-11-06

- Waiting for › Board: the → Name pill on a card named who had the task but
  did nothing when clicked, opening the card underneath it instead (#311). It
  now opens Ask for an update for that person and that task.

## 1.109.3 - 2026-11-06

- The line menu and toolbar: Copy embed, Copy text, Insert tracker and Plan
  with AI were the only rows on the ⋯ menu without their own Alt+ key (#310).
  They now have one each: Alt+B, Alt+X, Alt+K and Alt+A.

## 1.109.2 - 2026-11-06

- The line menu and toolbar: Repeat, Refile and Insert tracker dropped out
  of the ⋯ menu in the cut from twenty rows to a handful (#310) without a
  new home. They are back on it, next to Due and the other actions. Open
  side panel came out again the other way: the foot toolbar already has it
  as a direct button, so the ⋯ menu does not need a second way to it.

## 1.109.1 - 2026-11-06

- The line menu and toolbar: Copy text sat behind the foot toolbar's More
  button while Copy embed sat on the line's own ⋯ menu, splitting one kind
  of action across two places (#310). Move to…, Copy text, Copy embed and
  Plan with AI all moved onto the ⋯ menu now, next to Copy embed and the
  line's own properties. The foot toolbar's More button is gone; Side panel
  takes its place directly, since the ⋯ menu now covers everything else More
  used to.

## 1.109.0 - 2026-11-06

- The line menu and toolbar: the ⋯ menu listed about twenty rows and two
  lines of instructions above and below them (#310). It now shows five:
  State, Due and Project (hidden with nothing set), then Copy embed and Open
  side panel. Everything else still has its Alt+ key, or sits behind the
  foot toolbar's Type, Tag or More button — Type gained Meeting, Tag gained
  Project, and More now holds Side panel, Move to…, Copy text, Copy embed
  and Plan with AI, with "To area" and "Refile" merged into that one
  "Move to…" entry.

## 1.108.1 - 2026-11-06

- A task's panel: a capture line that is nothing but a link to its project —
  the normal way to file a todo under one, with the real steps nested below
  it — shows the project in the side pane now (#309), not the task panel. It
  had no task of its own to show: the raw `[[1/…]]` link sat in the title
  box, task states it cannot take lined up above it, and Project pointed
  right back at
  the same link already in the title.

## 1.108.0 - 2026-11-06

- A task's panel: the icon bar that hid Dates, Repeats, Chat, Who and History
  behind tabs is gone, along with the duplicate header it sat on top of —
  there is one header now, with the close button beside the source link and
  overflow menu. Where it sits is Project, Parent and Tags only; This todo,
  Siblings and the bordered Children box are gone (the project page's own
  "where it sits" picture is the same shape now, for the same reason). The
  nested steps under a task and the children:: link picker are one Subtasks
  section, with a checklist you can tick off directly. The Title and State
  labels are gone — the box and the buttons under them already say what they
  are — and the title grows with what you type instead of starting three
  lines tall. Scheduled, Deadline, Assign and Priority share one row when
  unset, instead of a two-column grid with a gap between them. Moving a task
  to another area is now in the ⋯ menu, not a second one. The standalone GTD
  hygiene row is gone too: a missing verb is a quiet nudge on the title
  itself, and an unfiled task's Project cell doubles as the refile nudge (a
  filed task's Project chip still offers Refile, from its own menu). Cancel
  it if still open after moved into the Deadline row as Auto-cancel after,
  and Add to calendar moved inside Scheduled. Repeats and Reminder are no
  longer always-on rows — Repeats shows once Scheduled has a day, Reminder
  once it has a time. (Fixes #308)

## 1.107.0 - 2026-11-06

- A task's panel: Scheduled, Deadline, Priority and Assign now start as a
  quiet "+" pill when a task has none of them, instead of four empty
  fields — click one to fill it in. Scheduled still opens by itself for
  Waiting and Hold, since those always need a day. The Urgency readout is
  gone (urgency already shows on the board and planner); the paragraphs
  explaining Assign, Chat, Repeats and Calendar are gone too, with what
  still matters left as a tip on hover. "Make it my usual" and "Choose
  where" for the calendar moved out of the panel; Add to calendar still
  asks where to send it the first time. (Fixes #307)

## 1.106.0 - 2026-11-06

- A task's panel: Scheduled, Follow up and Hold until are now one date field,
  not three — its label and what it writes follow the state you already
  picked at the top. Putting a task on Hold with a date no longer just hides
  it: it comes back as a task by itself once that day arrives, the same as
  any other state change. (Fixes #306)

## 1.105.0 - 2026-11-06

- A task's panel: a new Hold state sits beside To do, Doing, Waiting and
  Done, so parking a task no longer needs a separate on-hold field read
  apart from the rest. Every change in the panel now saves itself the
  moment you make it — there is no more Save or Cancel to click, or to
  forget to click. Cancelling a task, turning it into a note and deleting
  it moved off the main state row into a small ⋯ menu at the top, so the
  row only ever shows the states an open task can be in. (Fixes #305)

## 1.104.0 - 2026-11-06

- Contexts › Sort: each visible area is now its own column, side by side,
  instead of one long stacked list. Dragging a context into another area's
  column moves it there, children and all; holding Alt (Option on a Mac)
  copies it instead. The always-on "Move…" link is now a quiet ⋯ button
  that opens on hover, focus or tap, and offers moving or copying into
  another area too. The permanent instructional lines are gone in favour of
  what each control already says when you reach it. Sense where I am now
  shows, as a pressed toggle, whether it is currently switching by itself
  (#304).

## 1.103.1 - 2026-11-06

- Sense where I am: merging a context (by rename, alias or look-alike) now
  renames it everywhere Sense had remembered it by name too -- "here",
  "away", work hours, a saved place, what it learned -- so the merged
  context no longer comes back on its own the next time GroupToDo senses
  where you are (#303).

## 1.103.0 - 2026-11-06

- Journal › Week: a new week page now starts from `pages/8/week.md`, if
  present, with `%title%` filled in as the week's ISO id, before the every
  week lines carried from last week and the weekly reflection line. An
  existing week page is never touched again, and with no `8/week.md` file
  a new week looks as it always has (#302).

## 1.102.3 - 2026-11-06

- Keys on a line: on an iPhone, the foot toolbar now clears the keyboard's
  own accessory bar and Safari's floating address pill while a line is being
  edited (#299). Neither shrinks the visible page the way the keyboard
  itself does, so the toolbar reserves extra room above the keyboard on an
  iPhone browser tab; an app added to the home screen has no pill to clear.

## 1.102.2 - 2026-11-06

- The line menu and toolbar: every other emoji or Unicode symbol left in the
  app as an icon -- the sidebar's nav icons, pins, the pencil and scissors on
  book and journal rows, close buttons, checkmarks, warnings, envelopes,
  fold carets, move/urgency arrows, week and day arrows, and the handful of
  one-off icons on trackers, chores, birthdays and the feedback links -- is
  now the same kind of monochrome SVG the foot toolbar and line menu already
  use (#301). Two kinds of spot were left alone: the update-reply email,
  where an inline picture is not reliable across mail clients, and a small
  set of CSS checkmarks on dense table and grid cells, where the glyph is a
  pseudo-element rather than a real node.

## 1.102.1 - 2026-11-05

- The line menu and toolbar: the line's own menu (right-click or long-press)
  used a mix of flat glyphs and colour emoji for Person, Organisation and
  Meeting. Every icon there is now the same kind of monochrome SVG the foot
  toolbar uses, and the two menus draw the same icon for the same action
  (#301).

## 1.102.0 - 2026-11-05

- The line menu and toolbar: the phone toolbar's 15 flat buttons are now 8.
  Up, Down, Outdent and Indent stay direct; Task/Zettel/Project/
  Responsibility sit behind one Type button, Context/Person/Organisation
  behind one Tag button, and Photo/Image behind one Media button (Photo
  drops out on a mouse, with nothing to take a photo with). To area and
  Copy text moved to a trailing More button. Every icon on the bar is now a
  monochrome SVG at one stroke weight, instead of mixing those with colour
  emoji for Person, Organisation, Photo and Image (#300).

## 1.101.2 - 2026-11-05

- Keys on a line: the phone toolbar's sideways scroll now actually works on
  Android; an explicit touch-action that was meant to let it swipe was
  silently disabling the scroll instead (#298).

## 1.101.1 - 2026-11-05

- Keys on a line: the phone toolbar's sideways scroll now actually swipes on
  Android, instead of holding still because the tap-focus guard mistook the
  swipe for a tap (#298).

## 1.101.0 - 2026-11-05

- Keys on a line: the phone toolbar at the foot of the screen can now add a
  context, person or organisation too, and scrolls sideways instead of
  squeezing its buttons when it has more than fit (#297).

## 1.100.2 - 2026-11-05

- Getting started: the first-run screens lead with writing a note, with
  folder and naming pushed down as optional (#296).

## 1.100.1 - 2026-11-05

- Calendars: fix an import crashing with "Cannot read properties of
  undefined" when a meeting has an attendee or organizer, such as on Proton
  Calendar (#294).

## 1.100.0 - 2026-11-05

- Settings: meeting reminders keep the one-click times and add Custom…: any
  number of minutes, hours, days or weeks before, and as many reminders as you
  like. Each calendar can have its own reminders, under its name in Calendars
  (#292).

## 1.99.2 - 2026-11-05

- Calendars: Add calendar uses the private area you are on, instead of a
  shared area it remembered from before.

## 1.99.1 - 2026-11-05

- Calendars: when your area counts as shared, Add calendar says why and offers
  "Only I use this area" instead of asking you to make a new one.

## 1.99.0 - 2026-11-05

- Calendars: simpler. A list with Sync now, each calendar showing who sees it
  and when it last synced; add a calendar with just a link and a name (private
  by default); sharing, sync and remove live on the calendar itself; one
  reminder choice (Off to 1 hour, saved at once); meetings left by removed
  calendars are reviewed in one place. On the Journal, "Import calendar"
  shows when you open the date picker.

## 1.98.0 - 2026-11-05

- Settings: a folder shared only with yourself on other devices can be marked
  "Only I use this folder", so Calendars works in it.

## 1.97.0 - 2026-11-05

- Settings: the Journal's date box has a 📅 button that opens Calendars, so a
  calendar can be imported from where the meetings land.

## 1.96.1 - 2026-11-05

- Settings: Calendars no longer vanishes in a shared area. It stays and says
  why calendars do not come in there, and to switch to a private area. Help
  finds Settings by calendar, import, ics, ical and outlook.

## 1.96.0 - 2026-11-05

- Ways to run GroupToDo: a new help topic sets the four ways side by side:
  the web address, the downloaded file, and serve.py with or without a folder
  of its own. Tick what matters, such as calendar links, and what you cannot
  do, such as install Python, and it names the way that fits and how to start
  it. The way you use now is marked.

## 1.95.0 - 2026-11-05

- Vault and sync: the importer reads Dynalist and Workflowy exports. Pick the
  folder of .opml files (a .txt with no .opml beside it works too). Each
  document becomes a page, a folder a namespace you give a meaning, a checkbox
  or checkmark a task, and a note stays under its line.

## 1.94.1 - 2026-11-05

- Vault and sync: the importer puts every page in exactly one row, so the row
  counts add up to the pages in the vault. area, alias, title and settings are
  no longer page types. ppl/ becomes people, hold becomes active, and week
  journals (2026-W44) come across. GroupToDo's own folder guides are left out.

## 1.94.0 - 2026-11-05

- Vault and sync: GroupToDo-Importer.html is now three steps. It detects Logseq
  or Obsidian itself, fills in your name and area from the vault, and picks
  what each folder, tag and status becomes. Signals that mean the same thing
  share one row. The summary updates as you change a row, and Preview diffs
  opens a dialog. An @word becomes a context only if it names a context page
  or a usual context such as @home (#288).

## 1.93.3 - 2026-11-05

- Vault and sync: GroupToDo-Importer.html can file pages as Vision (horizon 4),
  Purpose and principles (horizon 5), E-mail and Review. Purpose and vision
  are one page each, so several pages chosen as Vision become one, each under
  its old title (#288).

## 1.93.2 - 2026-11-05

- Vault and sync: GroupToDo-Importer.html also asks about a #tag on a page's
  first line and short page properties such as status:: Active, in front
  matter or as key:: value. Give #Active or status: active a meaning, such
  as Project, active, and those pages are filed that way. A #tag further down
  stays on its line (#288).

## 1.93.1 - 2026-11-05

- Vault and sync: GroupToDo-Importer.html asks instead of guessing. Every
  folder and namespace starts on Choose…, the area has no default, and @word
  as a context is off until you tick it; it shows how many it found. A short
  code such as PR/A still gets its own row (#288).

## 1.93.0 - 2026-11-05

- Vault and sync: GroupToDo-Importer.html reads PR/A, PR/X and PR/C as
  active, completed and cancelled projects (1/, 0/, -/; S and W as someday and
  waiting), &/ as people, #/ as organisations and @word as a context. A plain
  #Work stays a tag. It asks which area the vault is, such as Work or Personal,
  and writes into that folder (#288).

## 1.92.0 - 2026-11-05

- Pages › Mind map: Children on a task has + New child (a next action) and + New parent (a task above it in the project). Each is a line
  that starts with a link to today.

## 1.91.1 - 2026-11-05

- Pages › Mind map: the name box suggests p/Anna. Examples in the help, docs,
  mockups and tests now use made-up people and made-up work (#286).

## 1.91.0 - 2026-11-05

- Journal: feedback is reviewed one item at a time. Since you were last here
  shows only how many comments wait, and Review opens the first. Each shows
  who wrote it, the project or to-do it is about, and Edit and Reply. It stays
  open until you choose an outcome: Continue (with a next action), Close,
  Cancel or Someday/Maybe for a project; Keep, Complete, Cancel or
  Someday/Maybe for a to-do. Ending work with open tasks asks first. An
  imported reply closes nothing by itself: its words are filed as comments and
  the review starts. History shows the outcome. Status changes stay in
  History (#285).

## 1.90.1 - 2026-11-05

- Chores: the help topic is shorter again, six steps and under 90 words before
  its More fold. Refs #282.

## 1.90.0 - 2026-11-05

- Chores: Due now and Coming up this week show the time they take, such as
  1 h 15 min + 1 unsized. Chores without a time are counted, never guessed.
  Print ends with the week total and chore count, and a line per person when
  whose is shown (#282).

## 1.89.0 - 2026-11-05

- Keys on a line (#281, #280): in a Markdown table, a Table button opens Row,
  Column and Alignment. Insert a row or column, move it, delete it, and set a
  column left, centre or right, without typing a |. Only the commands that fit
  the caret are shown, the header and the |---| line stay put, and each
  command is one Undo.

## 1.88.2 - 2026-11-05

- Chores: a task can take any time, not just 15, 30, 45 or 60 minutes (#283).
  Type #5m, #90m, #1h30m or #2h15m, and every total, the calendar end time and
  I have 20 min use the real minutes. The dots stay as a rough size. In
  + New chore and Log a chore, How long is now one Duration field: type a time
  or pick 15m, 30m, 45m or 1h. Points are unchanged.

## 1.88.1 - 2026-11-05

- Projects: Share → Readable page (HTML) now saves the file. The share sheet
  was offered for a page type the browser would not send, and nothing came out.
  It is checked against the real file type now, and falls back to a download.

## 1.88.0 - 2026-11-05

- Projects: ⋯ → Share has a third shape, Readable page (HTML), for a project
  that moves to someone outside GroupToDo. One file with the outcome, where it
  stands, open and done steps, and one history, oldest first: chats, Told
  entries, and the lines from day pages that link to the project (only those
  lines). Links and properties are plain words. It prints, saves as PDF, and
  has buttons to take the steps and history out as CSV or markdown. Fixes #276.

## 1.87.1 - 2026-11-04

- Updates: Check now no longer says it could not reach GitHub. The page policy
  now lets the update check read CHANGELOG.md from GitHub. Fixes #256.

## 1.87.0 - 2026-11-04

- Vault and sync: Settings is now rows of label, value and one action, in
  groups (Vault & sync, You, Preferences, Personal, GroupToDo). Planner and
  usage statistics moved to Integrations, the sync server and Check folder to
  Advanced, name and photo to Profile, area type and colour to Area. Chores,
  phone/place links and context check are single lists of choices. Signing with
  by:: and done_by:: is always automatic. Nothing stored is changed.

## 1.86.0 - 2026-11-04

- Weekly review: now a reading of Projects (Weekly review in its switch) rather
  than a place in the sidebar, with a way back to Projects. Marking the review
  done flies you through a starfield of your project cards: click one to make a
  star, and music builds up to a finale at 50. Celebration in the review turns
  it to no sound or off, and reduced motion gets a still card. Fixes #223.

## 1.85.0 - 2026-11-04

- Chores: + New chore has Custom... in How often (opens Repeats, so every
  2nd tuesday or every 3 weeks work) and Pick a date... in First one. Fixes #279.

## 1.84.1 - 2026-11-04

- Writing a chapter: the page's ... menu has Put back, which turns
  putback:: yes on or off for that page. Refs #254.

## 1.84.0 - 2026-11-04

- Writing a chapter: Put back is no longer only for darlings. Add
  putback:: yes to any page and a line refiled there remembers where it came
  from; the page gets a Put back button that returns it. Darlings is now just
  such a page. Part of the outliner-roots clean-up. Refs #254.

## 1.83.4 - 2026-11-04

- Writing a chapter: Beats (%%), Script, the thought, sound and written
  marks and Kindle notes import are gone. A line that starts with %% or holds
  a {.thought} mark is now an ordinary line, counted like the rest. Part of the
  outliner-roots clean-up. Refs #254.

## 1.83.3 - 2026-11-04

- Book › Revise: a chapter that moves on a stage is no longer copied to
  8/snapshots, and Revise no longer shows what changed since. Part of the
  outliner-roots clean-up. Refs #254.

## 1.83.2 - 2026-11-04

- Chores: the help topic is shorter, six steps. Fixes #217.

## 1.83.1 - 2026-11-04

- Weekly review: the #reflection line is written on the week page, not on a
  day page. A line an older version put on a day page is still found. Fixes
  #217.

## 1.83.0 - 2026-11-04

- Refile (Alt+G) lists the projects, responsibilities and contexts the line
  already links to first, in the order they appear, marked linked. The first
  one is chosen, so Alt+G then Enter files it there. (#278)

## 1.82.0 - 2026-11-04

- Chores: + New chore suggests the chores you already have, so Vacuum is the
  same chore in every room. A new name is offered next time, in New chore and
  Log a chore. Group by Room or Chore: by chore shows how many rooms and how
  long in all, and Print follows the grouping. Fixes #260.

## 1.81.0 - 2026-11-03

- Keys on a line: "Copy as plain text" in the line menu, and a "Copy text"
  button on the line toolbar, copy the line as plain words: the state and the
  title, without links, brackets, #tags, properties or the lines below.

## 1.80.1 - 2026-11-03

- Keys on a line: Ctrl+Enter now passes through Cancelled after Done and
  before turning the line back into a note.

## 1.80.0 - 2026-11-03

- Keys on a line (#273): a "To area" button on the picked-lines bar and on the
  line toolbar moves the lines to another area. Pages they link to move
  along. A page other pages also link to is mirrored instead, and a message
  says so.

## 1.79.1 - 2026-11-03

- Keys on a line: the button at the foot of the page that makes a line a
  responsibility now says "Responsibility", not "Area".

## 1.79.0 - 2026-11-03

- Keys on a line (#272): Ctrl+click picks a line, or drops it again, so you
  can pick every other line. Drag to pick now also starts on plain lines
  that do not begin with "- ".

## 1.78.1 - 2026-11-03

- Natural planning (#266): in Who it is for, a person is found by an alias
  too, and an alias is never offered as a new name.

## 1.78.0 - 2026-11-03

- Timer (#270): click or drag round the dial. Where you point is the
  minutes. Inside the ring it is silent; outside it rings. The middle starts
  the usual length or stops. The bell turns the alarm on or off, even while
  it runs, and keeps the time left.

## 1.77.0 - 2026-11-03

- Keys on a line (#269): write |Name|Phone| and press Enter to start a
  table. Enter adds a row, Tab goes to the next cell, and Enter on an empty
  last row leaves the table. The file keeps it as a Markdown table.

## 1.76.0 - 2026-11-03

- Keys on a line (#268): ( [ or { puts in the closing bracket too, with the
  caret between. In a word, or on picked words, the brackets go around them.

## 1.75.1 - 2026-11-03

- Dates and reminders (#265): a new date is Due by default, from Alt+D and
  everywhere else. Pick Scheduled in the date box to make it a start day.

## 1.75.0 - 2026-11-03

- Repeat and routines (#267): click the ↻ on a line, or press Alt+R, to open
  Repeats. Pick how often, then Save.

## 1.74.2 - 2026-11-03

- Dates and reminders (#265): a click on a date now says if it is Due or
  Scheduled. Pick the other one to switch it, then Save.

## 1.74.1 - 2026-11-03

- Links and aliases (#262): a name offered while you type now follows the
  key chosen in Settings > Writing. With Enter chosen, Enter takes it, in
  every place that offers names.

## 1.74.0 - 2026-11-03

- Dates and reminders (#263): a step takes its parent's date. An open step
  with no date of its own answers to the nearest dated line above it, so it
  shows under Due
  Today & Late and Next 7 days, sorts by that date and turns late with it.
  Nothing is written to the step; move the parent's date and its steps move
  too. A step's own date always wins, and a done line above gives no date.
  Setting a date that puts a step after the task above it, or a task before
  one of its steps, shows a warning; the date stays as given.

## 1.73.1 - 2026-11-03

- CLAUDE.md: the rest of the code navigation rules (#264). Do not explore
  directories to learn the architecture, reuse what the session has found,
  and run the targeted test before widening the search.

## 1.73.0 - 2026-11-03

- Names as you type (#258): with several areas on, a person's row in the
  list shows their area, in the area's colour, so Kenneth from Work and
  Kenneth from Home are told apart before one is taken. The link written is
  [[Kenneth Aar]] as before, with nothing about the area. With one area on,
  nothing is added. Wherever names are offered: a line, the capture box, a
  comment, a waiting-for.

## 1.72.3 - 2026-11-03

- Vault and sync (#181): a big folder opens in a new order. Today's journal
  is read alone and shown first. Then come yesterday back to a month, the
  active projects, the contexts, the people and the organisations, each on
  screen as soon as it is in. Until a file is read, a project, context,
  person or organisation is there by its file name, and a project waiting for
  its file is not called stuck. Waiting, someday, done and older days follow
  as before.

## 1.72.2 - 2026-11-03

- The built `grouptodo.html` is 23% smaller (no change to what the app does):
  the build leaves out comments, indentation and blank lines, 3.17 MB down to
  2.42 MB. The source in `src/` is as it was. `node build.mjs --readable`
  builds the file with them in, for reading it or matching an error to a line
  (#259).

## 1.72.1 - 2026-11-03

- The source is split up (no change to what the app does). The stylesheet is
  `src/css/` in pieces, every function is its own file under `src/js/`, and
  the icons are SVG files in `src/assets/`. `node build.mjs` joins them into
  `grouptodo.html`, which is still the one file that ships and still opens
  from a folder, a share or a phone. A pre-commit hook
  (`git config core.hooksPath .githooks`) builds it on every commit, so only
  `src/` is edited (#259).

## 1.72.0 - 2026-11-02

- Contexts › Sort (#257): every context as a tree, to stack one on another.
  Drag @kitchen onto @home and it is @home/kitchen, its tasks and links with
  it; drag it to the top line and it is on its own again. Move… on each row
  does the same without dragging, on a phone or with the keyboard, and Undo
  puts it back. Contexts › Cards is the page as it was.

## 1.71.2 - 2026-11-02

- Contexts: a card with contexts inside, like @home, takes the whole row and
  lists them in columns (#206). Each is one line: a long name is cut short,
  and to do, late and fresh line up under each other.

## 1.71.1 - 2026-11-02

- informed::, which an update you send writes on each task, no longer shows
  under the task line (#174). It stays in the file, and Inform still counts
  from it.

## 1.71.0 - 2026-11-02

- Chores › + Log a chore (#239): count work done at home that has no
  rhythm, like laundry or a sick child's bed. Pick what (what you did before
  is offered, with its room and size), room, how long, who did it and when.
  It writes one done line on that day's page, with done_by::, so Points,
  whose turn and the Report's "who carried what" count it.
- + New chore › How often › As needed: a chore with no rhythm. It never gets
  a bar, never turns late and never goes on Next or the Journal. It sits in
  its own As needed fold on Chores, with when it was last done and Did it,
  which logs it in one tap.
- Points says how many of each person's chores were logged.

## 1.70.0 - 2026-11-02

- Updates (#256): once a day the app looks on GitHub for a new version.
  When one is out, a note in the corner says what it brings, with Download
  now (or Update now on the hosted copy) and See what's new. New vN beside
  the name, top left, stays until you have it.
- What's new: the first time a new version starts, it shows what has come
  since the version you ran last, each with How it works for its help topic.
- Still missing a key feature? What's new and the help end with Suggest a
  feature, Report a bug and Star on GitHub, the version filled in.
- Vault & sync › More › Updates turns the daily check off, or checks now.
  Only the list of changes is fetched; nothing about you is sent.

## 1.69.0 - 2026-11-02

- One world, several books (#255): an area can hold a series. Each book is
  a page in `8/book/` with its own chapters, stages, goals, dialogue and
  protagonist, and all of them share the area's people, places and things.
  `8/book.md` still counts as a book. A tab per book switches between them,
  and Settings › Book picks the book and its place in the series
  (`order::`). A new book can go in an area that has one already.
- Cast shows who is in this book's scenes, and anyone in no book yet; All
  books shows the whole series. Timeline and Plot can read all the books as
  one story too.
- Open a chapter, and its book is the one shown, with its own dialogue style
  and words a day.

## 1.68.0 - 2026-11-02

- Book › Revise (#254): where the text could be tighter, a row per chapter:
  how hard it reads (LIX), words a sentence, sentences over 30 words, the
  share that is talk, telling words (felt, saw, realised), adverbs, and a
  word used twice within a few words. Click a chapter for the sentences, and
  one of them to go to it. Under it: the words you use most, and a fact on a
  person page (`eyes:: green`) the text says otherwise.
- Snapshots: when a chapter moves on a stage, a copy of it as it was is kept
  in `8/snapshots/`, archived. Revise shows the paragraphs new and gone
  since.

## 1.67.0 - 2026-11-02

- Book › Read (#253): the whole book as one text, each chapter under its
  name, in Prose. Change it as you read: it is the chapters' own pages.
  Beats and Focus work as on a chapter.

## 1.66.0 - 2026-11-02

- Kill your darlings (#252): `/darling` on a line in a chapter cuts the
  sentence the caret is in, or at the start of the line the whole paragraph,
  or on a scene's `##` line the scene. ✂ on a chapter in the Book view takes
  the chapter out of the book. What is cut goes to `8/darlings.md` with where
  it came from, and is not counted. Darlings in the Book view lists them;
  Put back returns each where it was. The words cut show beside the goal.

## 1.65.0 - 2026-11-02

- Book › Plot (#251): each plotline across the chapters. A plotline is a name
  in a scene's `plot::`; it gets a row, each chapter a column, and the
  scenes that move it on sit in their chapter. A plotline left alone for
  three chapters or more is tinted there. Scenes with no plotline are listed
  under it, a click away from giving them one.

## 1.64.0 - 2026-11-02

- Book › Timeline (#250): when each scene happens in the story, against the
  order the book tells them. `when::` under a scene's `##` line is read as a
  day (`Day 3`, `Day 3, evening`) or a date (`1987`, `1987-06-14`). Time runs
  across, a row per point of view, and each scene carries its number in the
  book. A scene told after one that happens later is marked ↶.
- Under it: the scenes told out of order, a character in two places at the
  same time, and the scenes with no time yet.

## 1.63.0 - 2026-11-02

- A book's characters are the people of its area (#247): person pages, made
  and kept as People does, with their aliases. + New character is People's
  New person, and + Make a page makes a person page. Somebody who uses the
  app is a writer, not a character. `type:: character` is no longer read.
- Setting up a book writes `8/place.md` and `8/thing.md`, the templates a new
  place or thing starts from.

## 1.62.0 - 2026-11-02

- Book › Relations (#249): the characters and what ties them. A line joins
  two who share a scene, thicker for more scenes and talk; a dashed line is a
  tie only their pages name (`sister:: [[Mira Berg]]`), with its name on it.
  The protagonist sits in the middle. Click a character to see only their
  ties; pick two chapters to see a part of the book. The ties are listed in
  words under it, strongest first.

## 1.61.0 - 2026-11-02

- Script mode (#248): Script on a chapter, or `/script` on a line, writes
  talk fast, as a play. A row per line with the speaker in front: Enter
  starts the next row with the next speaker, Tab changes who speaks, and the
  chips pick who is talking (the scene's people first). Ctrl+Enter puts it
  in the chapter as prose, in the book's dialogue marks, with "said Anna"
  only where a reader could not tell who speaks. `said::` in 8/book.md is
  the word used (said, sa, sagte by style).

## 1.60.0 - 2026-11-02

- Book has tabs: Chapters, and now Cast (#247), the story bible. A page in
  the book's area with `type:: character`, `place` or `thing` is in it, and
  so is anybody a scene names in `pov::` or `with::`, with + Make a page.
- Each one shows the scenes they are in, those seen through their eyes, their
  share of the talk, and their first and last chapter.
- A character shows four signs of depth, whatever their sex or love: a goal
  of their own (`wants::`), a change (`arc::`), scenes without the
  protagonist, and talk with others about something other than the
  protagonist. Missing ones show in the warning colour; the first two can be
  written from there. The protagonist is `protagonist::` in 8/book.md, or
  the one who sees the most scenes.
- Who speaks a line is read from the text: the name outside the quotes, or
  else back and forth between the two talking.

## 1.59.0 - 2026-11-02

- Marks for what is not plain prose (#246): `/thought`, `/sound` and
  `/written` (a letter, a sign, a message) put an empty mark at the caret to
  write in. They are kept as Pandoc spans, `[I must go]{.thought}`, so a tool
  that makes a book of the file keeps them. In the app a thought is in
  italics, a sound in spaced italics and what is written in type. The marks
  are not counted as words.

## 1.58.0 - 2026-11-02

- A book can say how its speech is set (#245): Settings > Book > Dialogue
  picks “English”, ‘British’, «Guillemets», „German“ or – Dash
  (`dialogue::`). In its chapters a `"` you type becomes the right opening
  or closing mark, `'` an apostrophe or single quote, `--` a dash and `...`
  an ellipsis. With Dash, `- ` at the start of a line becomes `– `.
- Tidy the book sets what is already written the same way; Undo puts it back.

## 1.57.0 - 2026-11-02

- A chapter page has Outline and Prose (#244). Prose shows plain paragraphs:
  no bullets, no steps in, and the line you write in stays in the middle of
  the screen. Focus hides everything but the page; Esc brings it back.
- A line that starts `%%` is a beat: what happens, the outline the prose is
  written under. `/beat` puts the `%%` on or takes it off. Beats are not
  counted or exported, and Prose can hide them.
- The words you wrote today show on the chapter and in the Book view.
  Settings > Book sets a goal a day (`daily::`).

## 1.56.0 - 2026-11-02

- A chapter can be cut into scenes (#243). A line that starts `## ` starts
  one, and it runs to the next. Values on that line say who sees it
  (`pov::`), who else is in it (`with::`), where (`place::`), when in the
  story (`when::`), its plotlines (`plot::`) and what happens (`synopsis::`).
- The Book view lists a chapter's scenes under it, with who sees it, when and
  its words. Click one to write in it; ✎ sets its name and values; + scene
  adds one at the end.
- The `## ` line is not counted as words. Export puts `* * *` between scenes.

## 1.55.0 - 2026-11-01

- A book has a name, a subtitle and a synopsis (#242). The Book view shows
  the name, the subtitle on the first line under it, then the synopsis; Edit
  changes them. Setting a book up asks for its name and the area it goes in
  (this one, another without a book, or a new one). One book per area.
- Each chapter can have a synopsis, under its name in the Book view. It is
  kept on the chapter page as `synopsis::`, and is not counted or exported.
- Drag a chapter onto another to move it, or press Alt+Shift+↑ ↓.
- With books in more than one area, the Book view has a tab per book.
- Export starts with the book's name and subtitle. The words so far are now
  beside the bar, not in the heading.

## 1.54.1 - 2026-11-01

- Add a chapter offers plain pages again, not only notes (#240).

## 1.54.0 - 2026-11-01

- In an area with a book, the names offered as you type are that area's own
  (#241): after `[[`, `@` or `#`, and while typing a word. Its pages and
  notes (characters, places) are offered too, but not its chapters. Names
  that link by themselves come from that area only, and a page is never
  linked unasked. Other areas are as before.

## 1.53.0 - 2026-11-01

- An area can be set up for writing a book (#240): Settings > Book > Set
  up for writing a book. A Book view (g b) lists the chapters in order, each
  with its stage (Outline, Draft, Revise, Done) and its words, and a bar
  for the words against the goal and the chapters done. Click a stage to
  move it on; Export puts the whole book in one markdown file. Settings picks
  the goal and the stages and moves the chapters with ↑ ↓. It is all kept in
  `pages/8/book.md` (a `[[page]]` per chapter, `target::`, `stages::`), and
  each chapter page says `stage:: Draft`. Task lines in a chapter are work on
  it, so they are not counted or exported. Set up also adds a Chapter task
  type and a Words tracker. Back to the default takes the page away; the
  chapters stay as pages. Without the page nothing changes.

## 1.52.0 - 2026-11-01

- The sidebar can be shaped per area (#238): Settings has a Sidebar section,
  a box per view to show or hide it and ↑ ↓ to move it, past a line into the
  next group. It is kept in `pages/8/sidebar.md` (one line per view, `---`
  between the groups, `hide::` for the ones left out), so everyone in the
  area sees the same. Settings is always shown, keys like g n still open a
  hidden view, and Back to the default takes the page away. Without the page
  the sidebar is as before.

## 1.51.1 - 2026-11-01

- Projects comes up sooner when a big folder opens (#181). The active
  projects (folder 1) are read on their own, first, and shown as soon as
  they are in; the week's day pages, people, contexts and organisations
  follow, then the rest. Projects also skips the look-alike check until the
  whole folder is read, instead of redoing it at every step.

## 1.51.0 - 2026-11-01

- On a phone the app opens on Next, the list of what to do now, instead of
  the Journal. Switching area on a phone lands there too. A wider screen
  still opens on the Journal, and a link still opens what it points at.

## 1.50.1 - 2026-11-01

- The Journal no longer shows the @context chip in the top bar (#168). The day
  page is not filtered by context, and on a phone the chip took a row of its
  own; now the area button sits in the top row beside ?. Next and the other
  views still show it.

## 1.50.0 - 2026-11-01

- The Journal's week fills a wide screen, with one area too, not only with
  several (#211). The seven days share the window, and a task in a day wraps
  over more lines instead of ending in "...".
- Next, Waiting for, People, Organisations and the Projects list spread out
  on a wide screen, and a long list of rows flows into columns, as the boards
  do. Pages and the help keep their line length.
- Settings > Styles has Content width: Narrow keeps the one reading column
  everywhere, Wide is the default, and Full takes the whole window. Under
  1100 px nothing changes, so a phone keeps its one column.

## 1.49.0 - 2026-11-01

- A chore's next round goes on the Journal, not beside the last one on the
  room page (#212). Daily chores and ones tied to a day (every monday,
  weekly on mon, thu, monthly on the 15th) go on that day's page. Weekly,
  every 2 weeks and monthly go on that week's page. The done line stays
  where it was ticked, so a room page no longer fills with done lines.
- The next round says its room, `[[c/home/kitchen]]`, so Chores, room
  freshness and whose turn still find every round.
- A chore ticked on a week page puts its next round in at once, like any
  other chore. A new week page no longer copies last week's chores, so a
  chore is never there twice.

## 1.48.0 - 2026-11-01

- Chores has a Print button beside Away until... (#235). It prints what is
  due now and this week on one sheet for the fridge, by room in the order of
  the room sort: a box to tick, the chore, LATE or its day, how often, the
  time from its size and whose turn it is. Nothing to set: it takes the room
  and whose chores the view shows.
- The browser's own Print now gives the whole view on every screen, not just
  what fits on it: no sidebar, top bar or buttons, and the closed folds open.

## 1.47.0 - 2026-11-01

- Chores work for the people at home who never open GroupToDo (#236).
  Mark somebody Household on their person page (it writes `household:: true`)
  and they take turns at the chores with the members.
- A chore handed to a household person stays a task, on Chores, instead of
  going to Waiting for: somebody in the house ticks it off for them.
- Ticking off a chore handed to somebody gives them the points, whoever
  ticks it: `done_by::` gets their name. "By ..." in the Done box says it
  was somebody else, and the next one's turn is worked out again.
- Chores has a chip for each person beside Mine and Everyone, so a child can
  be shown just their own chores on a shared tablet.

## 1.46.9 - 2026-11-01

- On a phone the "Done" toast is a thin strip along the top edge, the full
  width of the screen, with tighter padding and buttons (#80). Before, it
  was narrower than the toasts below it and stood out more.

## 1.46.8 - 2026-11-01

- The "Done" toast sits at the very top edge, above any other toast, so it
  covers less of the page (#80). With one thing in it, Backdate, Undo and
  the rest share the top row with History, and the name gets the whole
  line below. With more, each keeps its buttons beside its own name.

## 1.46.7 - 2026-11-01

- After "Allow access" the area no longer says "browser only - no files"
  while its folder is read (#232). Since 1.46.6 the folder is read behind
  the screen, and each save meanwhile put that back. Now it says "reading
  the folder..." until the folder's pages take over.
- A folder that cannot be read is asked for again, so "Allow access" can
  try once more. Before, the area stayed on browser storage without a word.

## 1.46.6 - 2026-11-01

- "Allow access" no longer hangs on "Opening area..." (#232). Since 1.46.4
  the screen waited until the folder was listed and today's files were read,
  and on a phone that can take minutes. One file a sync app has not
  downloaded yet could hold it forever. Now the area shows at once, the
  folder is read behind it, and today's page from the folder takes over
  when it is in.
- A file that does not answer in 20 seconds is skipped and left as it is in
  the folder, like a file that will not open.

## 1.46.5 - 2026-11-01

- A phone on a folder no longer asks you to send the vault file (#179). The
  phone drops the folder's permission each time the app closes, and until
  "Allow access" the area reads from browser storage, so it was taken for a
  phone with no folder. A folder area is now a folder area while it waits:
  what you do meanwhile goes up to the folder once it is allowed.

## 1.46.4 - 2026-11-01

- No day page is made while an area waits for its folder (#232). After a
  fresh download the folder needs your permission again, and browser
  storage holds only what the folder has not taken yet. So today's page was
  made from its templates alone. Now the day waits for the folder, and is
  made from the templates only if the folder has none.
- On "Allow access" the folder is read today first, as at start-up, not
  shown behind the browser copy.
- What browser storage kept for a folder is merged into the folder's page,
  line by line. Before, a newer browser copy replaced the page whole.

## 1.46.3 - 2026-11-01

- Today's journal shows what is written in it, not only its templates
  (#232). Read before its file was in, the day was poured from its
  templates, and that page was kept over the file until a line typed and
  saved merged the two. Now the two are merged as soon as the file is read,
  and nothing of either is dropped. The fix in 1.46.2, which started the
  area over from the folder, is taken out again.

## 1.46.2 - 2026-11-01

- After a fresh download the journal shows the folder's pages again as soon
  as you allow the folder (#232). Until then the area is read from browser
  storage, and on "Allow access" it stayed on that old copy while the whole
  folder was read behind it. The screen only caught up once you had typed a
  line and left it. Now it starts over from the folder, today first.

## 1.46.1 - 2026-11-01

- The Journal on a phone is the day page, as Next is its list (#222). The
  heading is one row: Journal, the day and ⋯. Day or Week, the trackers,
  what is due, Next 7 days and History fold behind the ⋯, and a red dot on
  it says something is late.
- Next says no "on your plate" beside its name, and on a phone Filter ▾ and
  List ▾ always stay on one line (#224).

## 1.46.0 - 2026-11-01

- The page on the right follows the review (#177). Open the page on a card in
  Weekly review › Projects or › Actions, and each next card dealt shows its
  page there too. Closing the pane, looking at another page there, pinning
  or leaving the review stops it.

## 1.45.7 - 2026-11-01

- A todo made into a project loses its TODO (#234). The line became the
  project's link but stayed a task, so it was counted twice. The project
  carries the status now. Making it a task again puts the TODO back.

## 1.45.6 - 2026-11-01

- Work is no longer lost when the installed app and a tab are open at the
  same time (#233). Both use the same browser storage, and each kept the
  copy it read at start. The one left open with an old copy saved that copy
  over what the other had just saved. Now a save is merged with what is
  stored, as a folder's is, so nothing either window wrote is lost. And each
  window tells the others what it saved, so they show it too.

## 1.45.5 - 2026-11-01

- A line typed in the journal while the area was still loading is kept
  (#232). When the rest of the area came in, the page was swapped for a
  fresh copy of its file, and the line went into the old copy and was lost
  when you left it. Now a page whose file has not changed stays the same
  page, the page you are typing in is never swapped, and the screen catches
  up once you stop typing.

## 1.45.4 - 2026-11-01

- The first screen is drawn once at start, not twice in a row (#231). On a
  big vault each drawing takes a second on a phone.

## 1.45.3 - 2026-11-01

- A big area kept in browser storage opens quickly (#230). It read and
  sorted every page before showing anything. Now it opens on today's pages,
  as a folder does, and the projects, people and older days come in behind.

## 1.45.2 - 2026-11-01

- An area on a GroupTodo server opens quickly (#229). It used to fetch every
  file just to see that the server was there, then fetch them all again to
  open the area. Now a ping says it is there, and a big vault opens on
  today's pages while the rest comes in behind, as a folder does. A server
  that has gone quiet is given up on after a few seconds instead of holding
  the start.

## 1.45.1 - 2026-11-01

- Opens quickly on a weak network (#228). The installed app used to wait
  for the network on every start, as long as the browser would, before it
  used the copy it keeps. Now the network gets 2.5 seconds; after that the
  kept copy opens and the new one is fetched for next time. serve.py says
  "not changed" instead of sending the 3 MB app again, and sends it zipped
  (0.9 MB) when it has changed.

## 1.45.0 - 2026-11-01

- Next on a phone shows the context you seem to be in (#226), with Show all
  beside it for the hour. The guess is learnt on this device from what you
  pick, a context or To do or Chores: the hour, the day, work hours or not,
  the phone upright or on its side, wifi or not, and the place, if the
  browser may say. It speaks once it is fairly sure; before that, Sense
  where I am's rules, if set up. Sense where I am uses what it learnt too.
- No nagging to send or bring in the vault file on a folder a sync app
  such as Syncthing keeps (#227): a folder or a GroupTodo server on a phone
  has no file to send, and a PC on a folder no longer asks for the phone's
  file unless one was brought in within two weeks. The start-of-day nudge
  has "The folder syncs itself" to stop it for good.

## 1.44.0 - 2026-11-01

- Next on a phone is To do or Chores (#225): two halves at the top, each
  with a badge of how many are open. Before and after work hours, and on
  days off, it opens on Chores; in work hours, on To do. Work hours are your
  work_hours::, else weekdays 8 to 16. A tap picks the other side until the
  next change of shift. A wider screen keeps the Chores chip.

## 1.43.0 - 2026-11-01

- Next on a phone is a plain to-do list (#224). The filters, sort and
  context chips fold behind one Filter button in the heading, which counts
  what is filtered away. A row is a round tick, the @context before the
  words, and one quiet line with the project and "Due …". The ⋯ goes:
  tap the row, or hold the tick, for the rest. A wider screen is as before.

## 1.42.4 - 2026-11-01

- Next's heading is one row on a phone (#224). The line beside the title
  reads with it, "Next on your plate", and ⤓ Export to Excel moves into the
  area menu, as on Waiting for and Projects. A wider screen keeps ⤓ in the
  heading.

## 1.42.3 - 2026-11-01

- On a phone ⇧ Send the vault file moves from the top bar into the area
  menu, as its first row (#168). The area button carries the dot for changes
  not sent yet. A wider screen keeps ⇧ in the bar.

## 1.42.2 - 2026-11-01

- On a phone the area button sits at the right end of the row with the next
  meeting and the @context, instead of on a row of its own (#168). With
  nothing on now it stays on the top row.

## 1.42.1 - 2026-11-01

- On a phone the day pager stands beside "Journal", on the heading's row, so
  the Journal's top is a line shorter (#222). Day, Week, Trackers and History
  go on the row under it.

## 1.42.0 - 2026-11-01

- The Journal on a phone, after a "Don't make me think" review (#222).
  - The day is said in words over the date box, "Sun, Nov 1 · Today", on a
    row of its own; a tap on it opens the date box. The weekday was hidden
    and the box too narrow to show its date.
  - Trackers, History and People are words, not 📊 ⏱ 👥.
  - The Due tab is one line: "Due", its bar, done of all ("0/3") and what is
    late. A wide screen still says "Due Today & Late" and "open · done".
  - An empty @context tab goes; the @context chip at the top says it already.
  - With one area the card does not say "Journal" again; the area's name is
    the way to focus on it.
- The area over a day page is a quiet eyebrow with a dot of its colour, not a
  coloured pill, so red is left for what is late. ✎ and 📌 there are grey.
- A meeting on its day page starts with its time, "12:00–13:00 Lunch", and
  two meetings that share time are marked "⚠ Overlaps …".
- A #tag is grey: the teal is the @context's alone.
- The next meeting at the top says "at 12:00" while it is more than an hour
  off, and counts down in the last hour.
- On a phone the capture field says "Capture" instead of a cut-off example,
  and the ⋯ line menu is a bigger target on a touch screen.

## 1.41.0 - 2026-11-01

- The weekly review walks on from Projects to Reflect, and from Reflect back
  to Steps (#216). When the last Projects pass was done there was no button
  onward, so the review lost its flow right before looking back.
  - When the Someday pass has nothing left to weigh, its end card has a
    primary **Reflect ›**, and says what is next. With nothing to reflect on
    (no intentions, no events or feelings this week), it is **Steps ›**
    instead, where the review is marked done.
  - Reflect ends with **Steps ›**, so Clarify › Actions › Projects › Reflect ›
    Steps can be walked without looking for the next tab.

## 1.40.0 - 2026-11-01

- Chores sorts the rooms by freshness, and has a board (#213). With 20 rooms,
  finding the ones that need you meant scanning every bar for its colour.
  - A sort beside the rooms: Name, Stalest first or Freshest first. This
    device keeps it, as it keeps the room you picked.
  - Grid or Board. The board has a column for each band the bars already
    use: red under 25%, yellow to 49%, green from 50%, each with its count.
    The columns and the cards in them follow the sort. A long column shows
    five rooms and a "+ n more" line.
  - A card per room: how fresh it is, how many are due, soon and ok, the
    time the due ones take by their size, and whose turn is next. Click it
    to see only that room's chores, as a room chip does.
  - A room picked on the board gets a close-up: the same facts with labels,
    the stalest chore, the next one up, the last one done and how many are
    on hold.
  - On a phone the columns stack, red first.

## 1.39.0 - 2026-10-31

- The weekly review's Actions leaves chores on track out (#215). Every open
  chore used to be dealt as a card, so an area with 60 chores had 60 cards to
  sort before the actions that matter.
  - A chore that comes round by itself needs no decision: it is in none of
    the four passes, and the side says how many were left out, with a link
    to Chores.
  - A chore missed for 2 whole rounds or more (the measure the Chores bars
    use) is dealt, with its repeat and how many rounds it is behind. Vault & sync
    › Chores in the weekly review sets the number; 0 leaves every chore out.
  - Its answers are Still to do, Done already, Change how often (the
    repeat:: dialog), Not this week, Not before next month and Let it go.
  - Done already on a chore puts the next round in at once, for whose turn
    it is, the way a tick on the Chores page does, instead of asking Again?.

## 1.38.0 - 2026-10-31

- Syncthing's conflict copies are merged into their page (#221). When two
  devices saved one page before they had synced, Syncthing kept one version
  beside it as `Name.sync-conflict-....md`, and the app showed it as a second
  page with half the work in it.
  - A conflict copy is no longer a page. Its lines go into the page it is a
    copy of, and the copy is deleted from the folder.
  - The same line in both comes out once. A task done in one copy and open
    in the other is kept once, as done, with the fields and notes of both.
  - Lines a page already had twice on purpose stay twice.
  - A copy whose page is gone becomes the page.
- A line both devices changed while saving (#220) also comes out once now,
  instead of twice.

## 1.37.0 - 2026-10-31

- A folder synced with Syncthing or another sync app no longer has its
  pages written over by an old copy (#220). The app reads a folder when it
  opens, so a tab left open kept the old version of a page that another
  device changed, and the next save put the old version back. That also
  made Syncthing leave conflict copies.
  - Before a page is saved, its file is read again. If another device has
    changed it, the two are merged against the version both started from:
    a line added, changed or taken out on either side carries over, and
    each field of the page keeps the latest edit.
  - Where both devices changed the same line, both versions are kept and
    the app says which page to check. Nothing is lost.
  - While you are typing, the merge waits until you stop.

## 1.36.0 - 2026-10-31

- Calendars moved from the Journal header to Settings (#218), and show there
  only in a private area: the one place a calendar comes into. The ↻ to fetch
  now goes with it. The phone's 📅 icon on the Journal is gone too; a
  calendar that did not come in is still said on Today.

## 1.35.1 - 2026-10-31

- A new project made from a line starts with the line's words as its name
  (#95): Refile's + new project, the loose action's New project for it, and
  the weekly review's New project for it box when you click into it.

## 1.35.0 - 2026-10-31

- The weekly review follows David Allen's three parts (#95): Get clear, Get
  current, Get creative, each one fold holding its steps and then the lists
  done in it, in his order. Get clear: loose actions on the day pages. Get
  current: the action lists (no verb, no context), what is left from past
  weeks and the coming weeks, birthdays, waiting for, then the projects.
  Get creative: someday/maybe. Worth a look and a new Housekeeping fold
  (broken links, lines written twice) come after; nothing is left open
  between the folds, and "Edit the steps" sits beside "Mark the review done".
- The built-in steps are in Allen's order too: papers and inboxes before the
  mind dump; action lists before the calendar; someday/maybe before the
  higher horizons.
- New vaults start with that list. The five-line list earlier vaults were
  started with ("Empty the inbox", ...) is read as the built-in one as long
  as nobody has changed it; a list you have edited stays yours.

## 1.34.1 - 2026-10-31

- Every headline on the weekly review's Steps page folds (#95), not only
  the step sections: Unfinished from past weeks, Calendar and coming weeks,
  Worth a look and each list under it. All are folded until you open one,
  and one you open stays open on this device. A step or a nudge that takes
  you to one of them opens it.

## 1.34.0 - 2026-10-31

- The weekly review's steps fold (#95): each section (Clear, Current,
  Creative) is one line, all folded until you open one. The line says how
  many of its steps are done and, in the section you are on, the next step.
  A section you open stays open on this device. A list without sections
  folds as one, under Steps.

## 1.33.0 - 2026-10-31

- Clarify, one line at a time (#95). The weekly review's Day pages tab is
  now Clarify: instead of a whole day page at once, it shows one loose line
  from your day pages, oldest first, and asks what it is. Seven answers in
  three groups: something to do (to do, waiting for, project), not now
  (someday/maybe, an idea to explore as a note of its own), nothing to do
  (done already, leave it as a note). Each answer says what it writes and
  the key that does the same on a page (Alt+1, Alt+2, Alt+Z, Ctrl+Enter).
  Click an answer, or aim with its number or first letter and press Enter;
  Backspace undoes the last one. A day is marked gone through when each of
  its lines has an answer.
- The Steps list is quieter: only the step you are on shows what it means
  and its buttons; the others are one line each.
- The review's tabs follow the order of the steps: Steps, Clarify, Actions,
  Projects, Reflect.

## 1.32.1 - 2026-10-31

- The look back and the look ahead are on the Weekly review page itself,
  under its title and above the steps, instead of in a Weeks tab of their
  own (#192): what is left from past weeks, then This week, Next week and
  the week after, each with its week page and its days. The step "Calendar
  two weeks back and four weeks forward" takes you there, and says how many
  things are left from past weeks; the calendar is its second button, for a
  longer look. That works in a review list you have already edited too.

## 1.32.0 - 2026-10-31

- Week pages in the Journal (#192). Day | Week beside the date switches
  between a day and its ISO week, 2026-W44; ◀ and ▶ step a week, Today comes
  back to this one. The week has a page of its own,
  journals/<your name>/2026-W44.md, for what belongs to the week and to no
  one day: routines, goals, a focus. Under it the seven days show only what
  is dated on them: meetings and times first, then what is due, what you
  wait for, what starts. A word shows under a line only when it is out of
  the ordinary: "! 2d late", a time, "starts", "waiting". Tick a task off in
  its day; a day's name opens that day. On a phone the days stand one under
  the other, an empty day as one line. The title says how many are late.
- A new week page takes the lines saying "every week" (or repeating weekly)
  from the last week page, unticked. Ticking one off on a week page no longer
  asks about the next one: next week's page brings it.
- [[2026-W44]] opens that week in the Journal.
- The weekly review has a Weeks tab: what is still open on a past week page,
  and what is late, in one list, oldest first, each with a pill to where it
  was written. Under it This week, Next week and the week after, each with
  its week page and its days, to plan in without leaving the review.

## 1.31.0 - 2026-10-31

- In the sidebar, a context with contexts inside it folds them away (#204):
  ▸ beside @home shows Home/Kitchen and the rest, ▾ folds them again. They
  start folded, so a long list stays short, and the one you are looking at
  shows anyway. Which ones are open is remembered on this device.

## 1.30.1 - 2026-10-31

- Typing @ finds a child context by its own name (#208): "@out" offers
  Home/Outside, and "@outside" typed in full is that context, not a new one.

## 1.30.0 - 2026-10-31

- Journal rows are one line each (#209): the state, the context, the words,
  then the project in quiet capitals, and the dates and other chips lined up
  at the right edge before ⋯. Short of room, the project gives way first and
  then the words end in "…". A row is about 36 px instead of 80, so a day of
  due tasks fits on the screen. A chore on its room's own page names the room
  once, by its pill, in every Journal list.
- On a phone, Due Today & Late is grouped by context: each context once, as
  its pill above its rows, the group with the most urgent task first. The
  project is left out there, so the words get the width. On a touch screen
  each row is at least 44 px high, so it is easy to hit.

## 1.29.0 - 2026-10-31

- A bullet journal in every area (#185). A line that starts with `o ` is an
  event and one that starts with `= ` is a feeling; under another line, a
  feeling is about that line. Their dot turns into a quiet ○ or =, they are
  never offered as to dos when you go through your day pages, and they show
  with their feelings under the person or project they link to. Typing `· `
  at the start of a line makes it a to do. Nothing to switch on.
- The weekly review has a Reflect step and tab once an area has intentions
  (`pages/_/Intentions.md`) or an event or a feeling this week. It shows your
  intentions, the week's events and feelings day by day, and Toward and Away
  on each. A pick is written as `toward:: ((id))` or `away:: ((id))` under a
  `#reflection Week N` line on your day page, and you write notes and to dos
  under that line. Intentions also show in the area's Horizons.

## 1.28.0 - 2026-10-30

- Enter takes a suggestion now (#190): a [[ link, an @ person or context, a
  # project, a date or a / command. Tab indents again while a list is open.
  Settings > Writing picks Enter, Tab or Tab or Enter for every list on this
  device. Shift+Enter still ends the line without taking it, and a word
  completion only ever takes Tab, so Enter after a word is still a new line.

## 1.27.0 - 2026-10-30

- Any page can have aliases now, not only people, organisations and areas
  (#207). Write aliases:: on a project, a context, a note or any other page,
  and @, # and [[ find it by that name; a link written by an alias shows the
  full name when you point at it. The Projects and Pages filters search
  aliases too.
- A context's alias is that context. aliases:: pc on @Computer makes @pc,
  typed, captured or picked, the Computer context instead of a new @Pc, and
  the line still links [[c/Computer]]. Giving a context an alias that is
  another context's name offers to merge the two, and never merges it with
  a person or project page of that name.

## 1.26.0 - 2026-10-30

- Trackers of one kind can share a chart (#195). Give water and coffee the
  same chart on their pages, and Trackers shows one Drinks card: both
  stacked by day, each named at its end, "8 together today · 6 💧 · 2 ☕ ·
  8.7 a day on average", and each value with the total when you point at a
  day. Trackers with different units never share one.
- Each tracker has a page of its own, pages/8/Trackers/coffee.md, made when
  you first open it with ⋯ on its card. Its icon, colour, chart and style
  are picked there, and anything you write under them is your notes. A
  shared chart has one style, stacked bar, side-by-side bar or line, so
  changing it on one tracker changes it for all of them. A tracker on its
  own can be a line or bars. When, area, Rename and Stop are on the page
  now, under the name, and the chart is shown at the bottom.

## 1.25.0 - 2026-10-30

- Contexts is easier to read (#206). One button, Sense where I am, in place
  of two look-alike links; the context chip at the top still picks by hand.
  Each card is one line: the context, how much is there, a red "N late"
  when something is overdue, and a chevron; the whole card opens it, so
  "things you can do here" and "Show in Next" are gone, and so is the big
  @ when a context has no icon. A folder's contexts are rows on its card:
  @Home/Kitchen sits under @Home. Actions with no context are a bar at the
  top with a link to the Next board, and the contexts with nothing to do
  are a quiet fold under the cards.

## 1.24.0 - 2026-10-30

- A context shows what you can do in the ones inside it (#205): @home has
  what is at @home/kitchen and at any context its children:: names. Its
  page, Next narrowed to it, its card on Contexts, its count in the sidebar
  and Where am I now? all count them. The Contexts inside chip takes them
  off, everywhere at once, and the choice is kept.
- A new context that looks like one you have is merged into it straight
  away (#203), and renaming a context to a name that is taken merges the
  two. The toast's Undo puts the context back with its links.

## 1.23.0 - 2026-10-30

- A new context starts with a capital (#203): phone is @Phone, home/kitchen
  is @Home/Kitchen. One already there keeps how it is written, whatever case
  you type, so home is the @home you have, not a second @Home.
- A new context that looks like one you have (@Phones beside @phone, @Errnd
  beside @errand, @Kitchen beside @home/kitchen) brings a warning toast with
  Merge into it, which merges the page and moves every link.
- Renaming or nesting a page onto a name that is taken, in any case, offers
  the same Merge instead of only saying it is there already.

## 1.22.1 - 2026-10-30

- A context's page lists the contexts in its folder (#201): home.md says
  children:: [[c/home/kitchen]], [[c/home/bathroom]], and it changes as they
  are put in or taken out. Opening + Put a context inside writes in the ones
  that were there before.
- + Put a context inside has + New context inside @home, so a room that is
  not a context yet is made right there, as many as you like. Renamed into a
  folder with no page, the page for the folder is made.

## 1.22.0 - 2026-10-30

- Daily, weekly, fortnightly, monthly, quarterly and yearly at the end of a
  line make it a repeat (#202), the way every week already did: "Vacuum
  @home weekly" repeats weekly. So does a rule that starts with one, like
  weekly on mon, thu. Only at the end, and never the whole line: a task
  called Weekly stays one.
- A context page has + Put a context inside (#201). It lists every context,
  also one only named on tasks with no page yet, and moves the one picked
  into the folder: @kitchen in @home is @home/kitchen.
- Rename a context or a plain page home/kitchen and it moves into home's
  folder, links and all, the way Logseq does with a namespace. Rename it
  kitchen and it comes back out.

## 1.21.1 - 2026-10-30

- Chores (#201) are only the repeats at @home or in a room inside it, like
  @home/kitchen. A weekly report at the office is not a chore. A new room is
  made inside @home, and the rooms are named without home/.
- Contexts in folders work again. @home/kitchen typed in the box at the top
  is one context, not @home and the words /kitchen, and @kitchen finds
  home/kitchen when it is the only kitchen. New context keeps the folder
  instead of making home-kitchen. A link to a context in a folder names the
  folder: [[c/home/kitchen]].
- A context's children are only other contexts: the ones in its folder, not
  the tasks written on its page. + sub context picks from the contexts, and
  the one picked moves into the folder, links and all. Undo moves it back.

## 1.21.0 - 2026-10-30

- Chores (#201): the home at a glance, in the sidebar once any task repeats.
  How fresh the home is and one bar per room (a room is a context); click a
  room to see only it. Mine or Everyone. Due now, worst first, then Coming up
  this week and Fresh, folded.
- A chore ticked in Chores puts the next one in at once, for whose turn it
  is, with no Again? dialog. Undo in the done toast takes both back.
- + New chore: what, room, how often, how long and the first one, each picked
  from a list. Away until… holds every chore until you are back, and they
  count from that day.
- Points: a point for each 15 minutes of chores done, one for a chore with no
  size. The board shows this week or last week, from done_by:: on the lines.
- Next has a Chores chip to hide the chores while you work.

## 1.20.0 - 2026-10-30

- A big folder reads what the day is planned from first (#181): the last
  week's day pages, active projects, people, contexts and organisations. They
  are on screen as soon as they are in, before the rest. People no longer
  come in last. Waiting for and Someday come next, then done and cancelled
  projects, then older day pages, newest first.
- While the rest of a folder is read, a bar under Pages in the sidebar shows
  how far it has come. Click it to see each file as it comes in, and how many
  of how many are read. It goes once every file is in (#199).

## 1.19.1 - 2026-10-30

- Natural planning (#189): Organise with no ideas no longer shows a table of
  boxes that do nothing and "0 of 0 left". It says there is nothing to sort and
  offers a button back to the brainstorm. A step you skipped no longer gets a
  ✓ in the step list.

## 1.19.0 - 2026-10-30

- A person on a line above counts for the tasks under it (#198), the way a
  project, context or area already does. A WAIT under `[[p/Joe Newmann]]`
  waits on Joe, shows in what he owes and goes in an update to him; a TODO
  under him is something to raise with him. A name on the line itself still
  wins over one above it.

## 1.18.1 - 2026-10-30

- Natural planning (#189): the second purpose question asks “What must this
  project achieve?” instead of the abstract “What would on purpose really
  mean?”. The page says Must achieve:.

## 1.18.0 - 2026-10-30

- Natural planning (#189): plan a project in six steps, one question at a
  time, laid out like the weekly review. Purpose and the rules you play by,
  what wild success looks like and the outcome as a finish line, a
  brainstorm with prompts to draw from (and, after three ideas of your own,
  three from an AI), sorting each idea on the numpad table into up to four
  components or next action, support, later or not needed, the order the
  components go in, a next action for each one that can start (who, where,
  then the verb), and a last check: off your mind, or back up or down.
- Finish writes the page in one change that Undo takes back: outcome::,
  purpose::, with:: and planned::, and the headings Purpose & principles,
  Outcome, Components (### 1. Name, after:: for one that waits), Support,
  Later and Brainstorm. Planning again reads them back in and rewrites only
  them.
- The draft is saved as you go, on this device and in
  _npm_for <project>.md beside the project, so another computer carries on.
  In a shared area somebody else sees who is planning and can take over.
- A new project asks: plan it now, just the outcome, or not now. Don't ask
  again is per area. The weekly review's next-action question has
  ✦ Re-plan it, which puts the project aside until the review is done.
  A project page has ✦ Plan (w n), and once planned, a panel with the
  outcome, purpose, principles, the next actions ready and each component's
  progress. A board card shows its purpose when you point at it.

## 1.17.5 - 2026-10-30

- Projects › Hours, Time on site, By project: a project's name in the week
  table opens the project (#50), in whichever area it is.

## 1.17.4 - 2026-10-30

- A project's Time on site leads with its total (#50): one large figure,
  then the number of visits and who came. The bars carry their own hours in
  the same h and m, every week with time is labelled, the weeks read W37 to
  W44, and this week is marked (now). The This week and last week text and
  the repeated total are gone, since the bars show them.

## 1.17.3 - 2026-10-30

- In Check in, the In/Out times or Hours, whichever you wrote last, is what
  counts (#50). Hours typed after starting on In clear In and Out, and a time
  typed after Hours clears Hours.

## 1.17.2 - 2026-10-30

- Check in is easier after the fact (#50). On an earlier day the In time
  starts empty instead of at the time now, and a time can be just the hour:
  8 is 08:00, 12 is 12:00. A visit you open has + Another time, for a second
  stretch the same day, such as 08-12 and 13-16.

## 1.17.1 - 2026-10-30

- The Timeline is quicker to read (#197). Zoom is one joined bar, and
  Dependencies and Dated only are checkboxes under Show, so it is clear which
  choices undo each other. The line through the chart says Today, the first
  month carries its year, and project names are no longer in capitals and get
  the whole column, with the
  count under them. The colour key sits inside the chart with a ? beside it,
  and grip dots on the ends of a bar replace the long line on how to drag.

## 1.17.0 - 2026-10-30

- The Timeline has a "Dated only" filter (#196). It shows only the projects
  with a task that has a SCHEDULED day or a deadline, and leaves out journals,
  loose pages and projects whose bars come only from the day a task was added.

## 1.16.2 - 2026-10-30

- An empty email, phone, address or web address now asks you to write it
  (#194). It used to offer every email already in the vault to choose from,
  but those belong to other people.

## 1.16.1 - 2026-10-30

- Setting up areas no longer offers a server (#193). Your areas and
  "I have used GroupToDo before" offer a folder or this browser, nothing
  else: a third place to keep files was one too many to choose between.

## 1.16.0 - 2026-10-30

- Areas are clearer to set up, and all their settings sit in one place
  (#193). The welcome screen has a third choice, I have used GroupToDo
  before, for a new web address (the file on disk to GitHub Pages or
  serve.py) or a new computer: each address starts empty in the browser,
  so you pick the folders you already have, one area each. Set up several
  areas now starts from the area you just set up, so it is no longer
  doubled (Personal beside Private). Your areas, once A folder for each
  area, holds each area's folder, name, colour (the dot by its name),
  order and Remove, with New area and Invite below. The area menu's
  Manage areas and Vault & sync both open it. Removing an area forgets it
  here: a folder keeps its files, an area kept only in the browser loses
  its pages, and the dialog says which. Use server is now Keep in
  serve.py's folder, offered only when serve.py was started with --vault
  (or its default folder already exists).

## 1.15.0 - 2026-10-30

- A person's page lists what you are waiting for from them, and their
  agenda (#191). A waiting-for that names two people, "[[p/Juta]] og
  [[p/Ola]] skriver to artikler", was handed to neither, so it showed in
  their Linked References but on nobody's list; it now waits on both of
  them, on their pages, in Ask for an update and in the People counts. The
  list once called Open is GTD's Waiting for, or Next actions for you and
  for somebody in the area, and under it comes Agenda: your own tasks that
  name them, the things to raise next time you talk, shown only when there
  is something on it.

## 1.14.3 - 2026-10-30

- A phone's folder is listed one folder at a time again (#188). Since 1.11.6
  every subfolder was listed at once, and on a phone that came back short:
  whole folders of people were left out, with no error, though the files
  were there. A file that will not open while sixteen are read together
  gets one more try on its own.

## 1.14.2 - 2026-10-30

- Pages in a folder that did not show in the app (#188). On a phone, people
  the app had written into the folder were missing from it, though the
  files were there.
  - A big folder reads people and projects second. Meanwhile the template
    pass filled those empty stand-ins in and stamped them as changed, which
    is where "163 changes could not be kept" came from. It leaves them alone
    now.
  - A second read that stops keeps the stand-ins from being saved over
    their files, and one file that will not open no longer stops the rest.
  - A second look at the folder can no longer lose files from a read under
    way, and a file that would not open is never written over.
  - A link to a page the app has not read opens the file instead of making
    a blank page over it.
  - Vault & sync → More → Check the folder says what the folder holds that
    the app does not, and reads it all again.

## 1.14.1 - 2026-10-30

- An area whose folder the app cannot reach shows a reconnect panel in
  place of its pages (#164). A phone drops the folder's permission each
  time the app is closed, and the area then opened on browser storage: an
  old copy, or next to nothing. A person added just before closing looked
  lost, though it was safe in the folder. Allow access (or Pick the folder)
  brings the pages back with one tap; Not now uses browser storage for the
  session.

## 1.14.0 - 2026-10-30

- A person's page picks the responsibilities they are a stakeholder in
  (#187). Stakeholder in, under Works at, has a pill per responsibility and
  + responsibility to add one; × takes them off. It is written on the
  responsibility's page as stakeholder::, so they show there too. An
  organisation's page has the same line.

## 1.13.3 - 2026-10-30

- A responsibility's values at the top of its page always have a
  stakeholders line (#158), with a pill per stakeholder and + stakeholder to
  add one, the way a person always has a birthday line. Before, stakeholder::
  only showed once it was written by hand, so there was nothing to fill in.

## 1.13.2 - 2026-10-30

- Getting started stays until every step on it is done or crossed off
  (#186). It used to close as soon as your name, folder and first task
  were done, and took the optional steps with it, so ticking one off could
  make the whole strip vanish. The count now covers every step shown, and
  a note says when it is done. ✕ still hides it for good.

## 1.13.1 - 2026-10-29

- The tour's "Tick off what you have done" prompt opens with every box
  empty, and "Tick these off" waits until you tick one (#184). Going
  somewhere is not the same as being done with it.

## 1.13.0 - 2026-10-29

- Sense where I am knows work hours (#183). Set the days, from and to,
  and the context you are in then, like weekdays 08:00-16:00 is @office.
  A saved place and being out and about still come first; work hours come
  before the device's usual context. Each device has its own, so the PC
  can say @office while the phone says nothing. A shift past midnight
  counts as the day it began.

## 1.12.0 - 2026-10-29

- Sense where I am (#183). GroupToDo guesses your context, so Next shows
  what fits. Press g l, or Sense it on Contexts or in the context picker.
  The first time it asks what this device is, where you usually are on it
  (a PC: @computer, a phone: @home) and where you are out and about
  (@errand). Stand somewhere and press Save this spot to tie it to a
  context. A saved place wins; a phone off wifi, or far from every place,
  is out and about. A web page cannot read the wifi's name, so a saved
  place does that job. When GroupToDo opens it offers the context it
  senses, or switches by itself if you say so. Places stay on this device.

## 1.11.7 - 2026-10-29

- The hint on Next says what to do (#182): pick a context (where you are or
  what you have), and GroupTodo shows the actions that fit.

## 1.11.6 - 2026-10-29

- A big folder opens fast (#181). Files are read 16 at a time instead of one
  by one. The first read is what the day needs: today's journal and the
  three days before, the settings, lists and horizons. Projects, people,
  contexts and organisations come in by file name only, and are read in
  full behind your back. Until then nothing is written over their files,
  and a vault file sync or export waits for the whole folder.

## 1.11.5 - 2026-10-29

- Trackers on a phone (#180). Each tracker on the day has one ⋯ that shows
  on a touch screen too, with When it comes round, Rename, Move to another
  area, Remove from this day and Stop tracking. The bare ✕ is gone: it could
  not be seen on a phone and was tapped by mistake. Removing one from the
  day always offers Undo, also when a template puts it on new days. On a
  narrow screen last time's value goes on its own line under the boxes
  instead of showing through the box you type today's in.

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
