# Changelog

The version is `APP_VERSION` near the top of `grouptodo.html`, and it is shown
beside the name, top left. Every change that is pushed raises it: the last
number for a fix, the middle one for a feature, the first one for a change
that breaks existing vaults. Newest first.

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
