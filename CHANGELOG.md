# Changelog

The version is `APP_VERSION` near the top of `grouptodo.html`, and it is shown
beside the name, top left. Every change that is pushed raises it: the last
number for a fix, the middle one for a feature, the first one for a change
that breaks existing vaults. Newest first.

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
