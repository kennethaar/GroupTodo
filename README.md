# GroupToDo

A shared to-do list that keeps everything as ordinary text files in a folder you
already have. Nothing to install, no account, no password, and no server. The
name is a nod to GTD, Getting Things Done, the method it is built on.

**Why this one can actually be shared.** Most task apps keep your tasks on their
servers, which is why sharing one is such a nuisance: everybody needs an account
on the same thing, somebody pays for the seats, and adding a colleague means
asking whoever administers it. GroupToDo has nothing to be a member of. Your
tasks are plain files in a folder — so share the folder the way you already
share folders and you are done. The sharing is your company's, not ours. Nobody
is invited to anything, and when somebody leaves you remove them from the
folder.

It also means the list outlives the tool. Every file opens in Notepad.

---

## Start in two minutes

On a computer, in Edge or Chrome:

Double-click `grouptodo.html` — nothing installs — and it asks three questions,
in this order:

1. **Who.** Your first and last name. Colleagues see it beside what you add, and
   the surname is what saves you the day there are two of you called the same
   thing.
2. **Where.** *Choose folder* — OneDrive, Dropbox, Google Drive, a network
   share, anywhere your files already live. Your tasks become files in there,
   saved as you type. Skip it and everything stays in this browser until you
   decide.
3. **What.** *Start a new list*, and type your first task.

Each answer makes the next question make sense: a name is what the folder gets
shared under, and a folder is what the first task gets written into. The name is
also what turns this from a list into a team list — your own day pages, your name
on what you take on, and you visible to everybody else.

**If people were already waiting on you,** the app spots it. A colleague who put
your name on something before you arrived could only file it as a waiting-for,
because nobody here could tick it off. When you give your name, GroupToDo offers
you that pile — take them on and they become your tasks, while staying in your
colleagues' *Waiting for*, because they wrote them.

**Your first project is the tour.** The first area starts with one project,
*Find your way round GroupToDo*, and every step in it is a door: an ordinary
task whose text links straight to the part of the app it is about — Next, the
calendar, Contexts, People, Routines & lists, the weekly review, Search, and the
folder your files live in. Press the link and you are there. Come back and
GroupToDo offers to tick off the steps whose destination you have now seen — it
asks, because only you know whether looking was enough, and it never ticks one
for you. They are tasks like any others, so reword them, reorder them or delete
the lot; when the last one closes, the project files itself away like any other.

To bring somebody in, use **the areas menu, top right → Invite somebody** (below). Failing that:
send them `grouptodo.html`, the name of the shared folder, and
`docs/setup-sheet.html` — the same three steps, written for somebody who does not
want to know how any of it works.

---

## How it works day to day

Nothing is hidden, but nothing appears before it is about something. Every
screen is a heading, at most one quiet row of filters, and the work. The **?
Help** button at the top explains the rest from inside the app.

**Your day page is yours.** Each person gets their own, so nobody types over
anybody. What you put on it is still visible to everyone.

**A task you write is yours.** No assigning, no ceremony. That is the common
case, so it costs nothing.

**Hand one over and it tracks itself.** Give a task to somebody in the area and
it becomes theirs, and it appears in your *Waiting for*. One task, two points of
view, never two copies, so ticking it off once is enough for both of you.

**Name somebody outside the area** and it becomes a plain waiting-for instead,
because they cannot see it and cannot tick it off. Calling that a task would be
a lie.

**You are told what you missed.** There is no server to push a notification, so
the app looks for itself. Today opens with *Since you were last here*: work
somebody handed you, a word on a task you are part of, and work you handed over
that is now finished. Dismiss it and nothing is lost: **History**, beside the
date on Today, scrolls back through everything that happened, day by day. "Last
seen" is per device and never written to the shared files, so marking your own
news read does not mark it read for everybody.

**Today is three tabs and a card per journal.** *Trackers*, *Due Today & Late*
and *Next 7 Days* sit in a row, each with its count. Click one to open it and
click it again to fold it away. Under them, each area's day page is a card,
such as the *Work Journal*, and its **Edit Markdown ▾** menu shows the whole
page as text. Trackers are values at the top of the day page
(`tracker-pullups_krrr:: 100/8/4/2`), not lines among your notes. A tracker
still written as a line is moved up there the next time Today opens.

**Meetings are lines too.** Press **Alt+M** on a line, or pick *Make it a
meeting* in the line menu, to tag it `#meeting` and give it attendees, a time
and an agenda. The agenda becomes the lines under the meeting, so the notes go
where they belong:

```
- #meeting Planning with Ola
  time:: 13:00–14:00
  attendees:: [[Ola Nordmann]], [[Per Dahl]]
  - Budget
  - Hiring
```

**📅 Calendars on Today brings your meetings in.** Paste a calendar's secret
iCal link (Outlook, Google, iCloud) and pick the area it goes into, such as
your private one. Every meeting in the next 14 days becomes a `#meeting` line on
its day page, and the import runs again every 30 minutes while Today is open.
The calendar decides the title, time and attendees. Anything you write under a
meeting stays. A meeting that leaves the calendar is removed, or marked
*Cancelled* if you wrote something under it. The links are kept on this device
only, because a secret calendar link in a shared folder shares the whole
calendar. The app may not fetch the internet itself (see the CSP below), so
`serve.py` fetches the link for it. If you open the app from a folder rather
than from `serve.py`, run just that part and leave it running:

```
python serve.py --calendars-only
```

It keeps no files and answers nothing but calendar requests. Until something is
fetching the links, Today says so, with *Try again*. Without `serve.py` at all,
download the `.ics` file and import that in *Calendars* instead.

### The screens

The sidebar holds the places you go every day. Most of them can be read more
than one way, and the switch for that sits at the right of the heading; each
screen remembers the reading you last used. None of them is a separate mode:
every one reads the very same blocks from the same markdown, and anything you
change in one is changed everywhere.

| Place | Readings | What it answers |
|---|---|---|
| **Today** | your day page | what is due or late, the next seven days, and your journal for each area |
| **Next** | List, Board, Calendar | everything on your plate; the board has a column per context |
| **Waiting for** | List, Board | what you handed over, grouped by who owes it |
| **Chat** | | every conversation on a task, once somebody else is here |
| **Projects** | List, Board, Timeline, Report | one list per status folder, the plan, and what got done |
| **People** | List, Cards, Board | who is carrying what; drag people onto the work |
| **Organisations** | List, Board | whose work it is; drag them onto projects |
| **Contexts** | | where you are, and what you can do there; each one is a page under `c/` |
| **Pages** | List, Board, Mind map, Graph, Hierarchy | everything in the areas on screen |
| **Horizons**, **Routines & lists** | | purpose and vision down through your areas to the next move; the lists you run again, the weekly review among them |
| **Weekly review** | Steps, Projects | the steps, and every project dealt as solitaire |

**Areas are a filter, not a switch.** The squares at the top right are the
areas on screen. Tick any combination and every screen shows exactly those,
with a coloured tag for its area on everything while more than one is
showing. The area whose name you click is where new things land. The same menu
holds each area's folder, its colour, and *Invite somebody*.

**Your areas are Horizon 2.** In GTD the parts of your life you keep in good
shape and never finish are your areas of focus, and here each one is a folder of
its own. **Horizons** reads them as one ladder: purpose and vision from your home
area (the first one you made), goals gathered from every area, then the areas
themselves, each with the responsibilities it holds (pages under `a/`), then
projects and next actions. Open an area there to see and edit its own ladder.

**Today, a section at a time.** Every section on Today folds like a line in the
outline: the arrow or the title folds it away. The bullet in front of it focuses
on it, and so does the bullet in front of any line: everything else leaves the
screen and only the trail back out stays above it. Back walks out of a focus
like any other move. On a wide screen the journals sit side by side, one column
per area.

**Another day.** The arrows and the date box at the top of Today step the
journals back and forward a day, or jump to any date; *Back to today* returns.
What is due stays about today. Looking at a day with nothing written leaves no
file behind: *Write on this day* starts that page.

**Next** is everything you can do, filtered by To do and Doing and by context.
As a **board** it has one column per context, with the tasks that have none
pinned on the left so they get sorted; drag a card to another column to change
where it can be done. As a **calendar** it is a month at a time, Monday first,
and the next two weeks go to your own calendar in one press.

**Waiting for** groups what you are owed by person, with *Ask for an update*
beside anybody outside the area. As a board it has a column per person, and
dragging a card to somebody else hands it to them instead.

**Things to ask somebody** show up there too. A task of yours that links a
person, *ask [[p/Alexander Bee]] about [[Pollen]]*, is still yours, but it
stands under that person with a *to ask Alexander* pill. It goes in the same
check-in as what they owe you: one email with both by default, or **Two
emails: questions apart** in the ask dialog, which makes a second sheet and a
second note that is only questions.

**Tags are your own labels.** Write `#anything` on a task (`#urgent`,
`#invoice`, `#q4`) and it is a tag. Both task boards, Next and Waiting for,
can switch their columns to **By tag**: one column per tag, with the untagged
on the left. A task with two tags stands in both. Dragging a card to another
column swaps the tag of the column it left for the one it lands in, and *No
tag* takes them all off.

**Export to Excel** in the heading of Next and Waiting for saves what is on
screen as a CSV file. Projects has **Export all tasks** for every task in the
areas you are showing, open or finished, and the Report has its own button.
The file uses the list separator your machine expects (a semicolon where the
decimal mark is a comma), and æøå come through intact.

**Projects** lists one status folder at a time: Active, Waiting for,
Someday/Maybe, Completed and Cancelled, with an organisation filter. A project
in *Active* whose open steps are all waiting on somebody is shown under
*Waiting for*, marked *auto*. Each row says what is late, what it is blocked
by, whether it has a next step, who is involved and how far along it is.

- **Board**: one column per status folder. Dragging a project moves its file,
  and every link to it follows. Drop one on an area tab to move it into that
  area; hold ctrl to copy it instead.
- **Timeline**: a Gantt. Every project is a bar from the day its first task
  starts to the day its last one ends, with its tasks underneath when you open
  it. A bar is drawn from what the file already carries: `SCHEDULED::` or the
  day it was captured for the start, `DEADLINE::` or the day it was ticked off
  for the end, and today for anything still running. A project goes red, and
  says *late*, as soon as anything open inside it has run past its end. A task
  with no date at all gets no bar: it is counted underneath instead, because an
  invented span reads exactly like a real one.
- **Bars move.** Drag one along to reschedule it, drag either end to change when
  it starts or when it is due, and drag a *project* bar to take the whole project
  with it: every open, dated task inside keeps its shape and shifts together.
  The dates follow the pointer while you drag, and nothing is written until you
  let go. A drag only ever writes `SCHEDULED::` and `DEADLINE::`; `Added::` is
  history and is never rewritten. Closed tasks have no handles. On a keyboard,
  focus a row and use `Alt+←` / `Alt+→` to move it a day, with `Shift` for a week.
- **Report**: what actually got finished, over a week, month, quarter, half
  year, year or dates you type, by person and by area, grouped by customer,
  project, person or month. It reads `done_by::`, which is stamped on the tick,
  so nothing new is recorded to make this work. **Copy as text** puts it on the
  clipboard ready for a status mail. Tasks marked DONE by hand in the file carry
  no date, so they cannot be placed in a window, and the count of those is shown
  rather than quietly dropped.

**Every list view works the same way.** The heading holds the view's own
actions and *+ New …*, then the List / Board switch. Under it, one row: a box
that filters by any words you type (only the list redraws, so you never lose
your place), then the chips and choices for that view. Next, Waiting for,
Projects, People, Organisations, Pages and Routines & lists all have it.

**People and organisations on a board.** On the People board, drop a person on
a project to involve them (`with:: [[p/Name]]` on the project page), or on a
next action to hand it over. On the Organisations board, drop an organisation on
a project (`org:: [[o/Name]]`). The board writes exactly what the page would
have said anyway.

**Pages** lists every page, by how recently it was edited or how much links to
it. The chips along the top pick a folder; journals are a folder of their own,
kept out of *All pages*, and one of your own day pages opens on Today at that
day. The box in front of them filters by any words in the title or the path.
Clicking one opens a preview with its values, what is open in it and what links
to it; *Open full page* goes the rest of the way. The other readings:

- **Board**: a column per kind. Drag a card to another column and the page
  changes kind: the file moves into that folder and every link follows.
  The same move is in **Rename** (or **Move**) in the ⋯ beside a page's title:
  name and folder sit in one dialog, so a page filed in the wrong folder is
  fixed where you would fix its name. Moving into a project folder sets the
  status as well.
- **Mind map**: one page in the middle, what links to it above, what it links to
  below, and its tasks hanging off it.
- **Graph**: every page as a dot, every `[[link]]` as a line (values such as
  `area::` count too), pulled together until it settles. It takes sides so the
  picture means something: day pages are off until you turn them on, because a
  day mentions everything and melts every cluster into one, and pages with no
  links at all are listed beside the picture instead of floating in it. A
  click picks a page: its neighbours light up, and the panel says what it links
  to and what links to it, with *Open*, *Preview* and *Mind map*. *1 step* or
  *2 steps* cuts the map down to the page's neighbourhood. With nothing picked,
  the panel lists the hubs, the links to pages nobody has made yet (a hollow
  dot; *Make this page* makes it) and the pages nothing links to. Type to find
  a page, `/` jumps to the box, Enter on a picked page opens it, Esc lets go,
  double-click opens. The map draws the 500 best-connected pages first and
  says how many it left out, with *Show more* and *Show all*; a big vault takes
  a moment to settle, which is fine. **▶** replays the vault growing, oldest
  first: each page arrives on its day (a day page on its date, any other page
  on its `created::` date, or with the oldest page that links it if that is
  earlier) beside a neighbour already there, with the date in the corner.
- **Hierarchy**: what is a child of what, from `children::`.

### Writing on a line

Today, every page and your own page are an outline you write in. Click a line
and type. A menu opens right under it: what the line is, its state, when it is
due, where it is done, who has it, whose work it is, which project it belongs to
and whether it comes back. Each row shows its key, so the menu teaches the keys
by being used. When a line becomes Waiting with nobody named, the menu asks who
you are waiting on.

**Names and dates are picked up as you type.** Start typing the name of a
person, an organisation or a project you have used before and it is offered;
`Tab` takes it and turns it into a link. A name written out in full is linked by
itself when you leave the line, and so is a person's first name while it
belongs to nobody else. Contexts are ordinary words, so they only link when you
pick them. Dates work the same way: *tomorrow*, *friday*, *next week*, *end of
month*, *in 3 days*, *15 oct*. `Tab` makes it the line's due date, and on a task
a date written at the end of the line becomes its due date when you leave the
line. The capture box at the top and the reply box under a task read names the
same way. `@`, `@@`, `#` and `[[` still list people, contexts, projects and
every page.

In the capture box, a context you already have works as the last word, before
any date: *Call Mia about the VAT phone tomorrow* is a call, at `@phone`, due
tomorrow. Only the last word counts, so *Buy a phone charger* stays about a
phone. `@phone` is the context too, when nobody is called that; `@mia` hands
the task to Mia.

### Your page

Click **GroupToDo** at the top left. Your page has one copy in every area, so
they sit side by side like the journals: your notes in that area, and every
page there that links to you. Each area has its own picture of you, set in its
column, so the people in Work see the one you put in Work.

### The weekly review

**Weekly review** walks you through the steps in three groups, and below them
everything the app thinks is worth a look, with a count beside it in the
sidebar:

- **Clear**: horizons of focus, mind dump, papers, phone messages, the
  downloads folder.
- **Current**: the calendar two weeks back and four forward, contexts and
  reminders for what you are waiting for, a next action for every project (or
  move it to Someday/Maybe or Done), routines and checklists.
- **Creative**: anything in Someday/Maybe ready to become a project, and
  celebrate.

Tick each step off as you go; a step with a link opens the part of the app it is
done in. The steps are an ordinary routine, `pages/8/Weekly review.md`, shown
first in **Routines & lists**: edit it to reword a step, drop one or add your
own. A top line is a section, the lines under it are steps, the first line under
a step says what it means, and a `[[go/...]]` link makes the step a door. Until
you edit it the built-in steps are used and nothing is written.

The projects step is played as solitaire: one project at a time, stalest
first, in three passes through the deck.

1. **Status**: every project, with a switch to deal waiting and someday/maybe
   too. Is it still active, waiting, someday, completed or cancelled?
2. **Outcome**: only what is still active. What done looks like, which
   responsibility it is part of, the deadline, and what comes first.
3. **Next action**: only what is still active. The very next thing to do, the
   people in it and the organisations it is for.

Why passes, and not everything about one project before the next? Each kind of
question needs a different kind of thinking. Sorting by status is quick;
saying what done looks like is strategy; the next phone call is tactics.
Switching between all three on every card wears you down. Getting stuck on a
hard next action halfway through is how weekly reviews get abandoned. Sorting
first is quick and clears out what is done or dropped, so the slower passes
only cover projects that still need thought.

Each new project is dealt onto the table. The last card's answers are gathered
up, the new card slides in face down and turns over, and then its answers are
dealt. You always know you have moved to a different project. Every field
shows its options from the project's own area. A long list shows the ten you
are likeliest to want (what is picked, then what is used most) and *Show all* opens the whole list, scrolling, with a
search. Click one, or drag the card onto it, and add a missing responsibility or
organisation straight from the field. A card with every field answered is
stamped `reviewed::`.

### Projects that have to happen in order

The survey comes before the drawings, the drawings before the quote. Until you
write that down it lives in somebody's head, and a project sits at the top of
*Active* looking perfectly startable while the thing it actually waits on has
not been touched.

On any project page: **nothing comes first** (or **after …**, once there is
something) opens a list of your other projects. Tick what has to finish first.
It is saved as one line of ordinary markdown —

```
depends_on:: [[1/site-survey]], [[1/planning-permission]]
```

— so the order travels with the files and reads fine in Notepad. A project
that would end up depending on itself, however long the way round, is not
offered; the cycle check runs before the list is drawn rather than after you
have saved.

What it then buys you:

- The project page says **blocked by Site survey** while a prerequisite still
  has anything open, and **N projects waiting on this** on the other side of
  the arrow.
- On the **Timeline**, prerequisites are joined to what they gate with an
  elbowed arrow, and a marker sits on the track at the first day the chain
  allows the project to start. If the bar starts before that marker, the
  overlapping part is hatched and the arrow turns red — it is scheduled to
  happen during something it is supposed to be waiting for.
- Drag a project bar and anything downstream that no longer fits offers to
  move with it: *"2 projects downstream now start too early — push them
  along"*. Offered, never done quietly. Moving your own project is your
  decision; moving four more is a different decision.
- The **starts N days too early** button on the project page pushes just that
  one project clear of what it waits on.

A prerequisite counts as cleared when it has nothing open left, or once it is
filed as completed or cancelled. *Someday/maybe* does **not** clear it — a
project waiting on something nobody intends to start is exactly what you want
told about.

### Waiting for an update from somebody who does not use this

Half of a shared list is work other people owe you, and most of those people
are not in your folder and are not going to be. *Waiting for* already knew what
they owed; what it could not do was ask. So you wrote the same mail by hand
every fortnight, pasted four task titles into it, and typed the answers back in
one task at a time.

One file does the round trip now. There is [a mockup of the whole
exchange](docs/check-in-sheet-mockup.html) — open it in a browser and tap the
rows.

1. **Ask.** **Waiting for**, or the person's page → **Ask … for an update**. Everything open
   with their name on it is already listed and already ticked. Untick anything
   you would rather not raise, and press **Make the sheet**. The lines written
   under each task go along as context, indented under it in the mail and on
   the sheet, each with its own tick so a note meant for you alone can stay
   behind. The conversation on a task never goes.
2. **Send.** You get `grouptodo-check-in-mia-halvorsen.html` — one
   self-contained page, no network, no libraries, no fonts to fetch — and a
   covering note to send it with, in your own voice, ready in your email or in
   Teams. You attach the file yourself; no link of any kind can do that for
   you. The note names the actual things you are waiting on, because a stranger
   could not have known them, and that is what tells the person the mail is
   really from you — an HTML attachment from somebody is shaped exactly like a
   phishing mail. It also says outright that they can ignore the attachment and
   just reply in words. A request nobody is allowed to refuse is a request
   people learn to ignore.
3. **They tick.** They double-click it and it opens in whatever browser they
   have. One tap per thing they finished, a note where a note is worth typing,
   then one button. That writes a small markdown file — readable in any editor,
   so it survives being pasted into the body of an email. Their ticks are kept
   in their browser, so closing it halfway through costs nothing.
4. **Import.** Open their file here — **Waiting for → Import a reply**, or the
   same button on their page. You get a review listing exactly what
   will change, with every row droppable, before anything is applied.

Applying it closes the tasks they ticked, stamped `done_by:: Mia Halvorsen`,
and files their notes as ordinary comments on the tasks **in their name**, so
the thread reads like they said it — because they did. Anything they left
unticked is left alone.

**The sheet is not a copy of your vault.** It carries the lines you chose and
nothing else: no project names, no colleagues, no other tasks, no files.
Somebody forwarding it leaks four sentences, not an area. It also never needs
an account, a login or a server — the same bargain as the rest of GroupToDo.

Sending one stamps `asked:: <your name> <when>` on each task, so *People* can
tell you *"3 things owing · asked 11d ago"* rather than making you remember,
and the nudge **people to send a check-in to** counts anybody who has gone
quiet past the two-week mark. The stamp is dropped the moment they answer:
"asked and heard nothing" is the thing worth measuring, and once they have
replied there is nothing outstanding to measure.

### Linking to a task from anywhere else

"Did you correct the colours on the rollup?" is a sentence somebody types in
Teams, in an email, in a text. **Copy link** — on a task, or on any page — gives
them a way back to the exact thing.

```
https://your-host/grouptodo.html#gt&s=Work&p=pages%2F1%2FRollup.md&b=4bnggdod
```

Area, file and block. Opening it switches area if it needs to, opens the page
and pops the task itself. A link to something this vault does not have says so
rather than landing you nowhere.

Block ids are regenerated every time a file is parsed, so copying a link is the
one moment a durable one is needed: it stamps `id::` on that block, in the
markdown like everything else.

Links work best when the app is served from a URL, since then everybody has the
same address. From a downloaded file the link still works for anyone whose copy
sits at the same path, and the dialog says so rather than pretending.

### Faces, and who has been here

**One name and one photo per area.** Both belong to that area alone: the name
is kept on this device, the photo in your own page inside that vault, so Work and
Private can show different ones and neither follows you between them.

**Add a photo of yourself** on your own page: click GroupToDo at the top left,
and pick it in the column of the area it is for. It opens the ordinary file
picker, which on a phone offers the camera or your photo library.

The picture lives in your own person page as a `data:` URI, so it travels in the
vault like everything else: no upload, no server, nowhere else for it to go
missing. It is redrawn at 96px and the quality stepped down until it fits a hard
24KB ceiling — a 470KB, 1200×900 photo comes out at about 2KB of text. No
picture means initials in a colour derived from your name, stable everywhere.

**`last_seen::`** on the same page answers "has anybody even opened this
lately". It is written at most once an hour, so it does not churn the file, and
shows up in People (*last seen 3 hours ago*, *here now*) and beside a name in
chat. An area with `no_attribution:: true` records this too — same promise.

### Undo

Deleting was one click and permanent. Now a delete offers **Undo** in the toast
for twelve seconds, `ctrl-z` works for five minutes, and both put the thing back
where it was — a task into its old position with its thread intact, a page with
its tombstone lifted so the next sync does not quietly delete it again
everywhere else.

What is kept is the removed thing itself, not a snapshot of the page: restoring
a whole page would discard anything else that changed on it meanwhile, which is
a worse bug than the one being fixed.

### Things that come back

A task can carry `repeat:: weekly` — or `monthly`, `every 2 weeks`, `every
monday`, whatever you write in the file. **Nothing is created until you tick the
current one off, and even then you are asked.**

That is the whole design. A scheduler fills your list while you are away and
hands you a wall of overdue chores on the Monday; this does not. Skip a week and
you have skipped a week — there is no backlog of imaginary Mondays. Ticking one
off late still puts the next one in the future, never in the past, and a monthly
job on the 31st lands on the 28th in February rather than rolling into March.

The next one carries the title, the repeat and who it is assigned to, and leaves
behind what belonged to that one doing of it — the dates, the done stamp.

### Talking on a task

"Done except the VAT bit" used to have nowhere to go: you could only edit
somebody else's words, which loses who said it and when. Every task now has a
thread.

```markdown
- TODO Draft the welcome letter
  assigned:: Alice Berg
  - Numbers are in the shared sheet
    msg:: Kenneth Aar
    at:: 2026-10-07T19:05:39Z
    flagged_by:: Alice Berg
  - Found them, VAT line is missing though
    msg:: Alice Berg
    at:: 2026-10-07T19:05:44Z
```

A message is an ordinary child block, so it nests under the task in Neovim and
the block-level merge means two people posting at the same moment both survive.
It carries no state, so it is not a task and never shows up in a to-do list.

**The thread reads as a conversation.** Bubbles — yours on the right, theirs on
the left — with the name, the time and *last seen* sitting **outside** the
bubble, because a bubble holds what was said. A face per speaker, a run of
messages from one person under one name, day separators, times you can use
(`8:30 AM`, `Yesterday 2:02 PM`, `Mon`), and one `New` line where the unread
starts rather than tinting everything.

**Read is per device and never written to the vault** — you reading something
must not mark it read for everybody. Rows show `○ 2 new` while anything is
unread.

**A flag is the opposite.** `flagged_by::` carries your name in the file, so what
you flagged follows you between devices and your colleagues can see you have
picked it up.

**Chat** gathers every thread you have — across every area you are showing,
every project and every day page — newest first, with the task it belongs to,
who spoke last and what they said. Filter it by *All*, *Unread* or *Flagged*;
click a row and you land on the task itself, switching area if it lives in
another one. The nav entry appears once there is a conversation to find.

New messages on tasks you are part of also turn up in the arrival notice.

### Dates in your calendar

Anything with a date gets **Add to calendar**, and **Next → Calendar** sends the
next two weeks at once. Two routes, deliberately different:

- **A file** (`.ics`) is built on your machine and goes nowhere. Works with every
  calendar, including desktop Outlook and Apple, and works offline.
- **A link** opens Outlook's or Google's own new-event screen with the fields
  filled in — one click instead of download-then-import, at the cost of the title
  and date travelling in the web address. Fine for a meeting; worth a thought for
  anything private.

Your choice is remembered, per device. **Nothing is ever subscribed**: a live
feed is fetched by Microsoft's and Google's servers, so it would mean the whole
list sitting at a publicly reachable URL protected by nothing but obscurity. The
app has no such thing and no way to make one.

### Sharing, and not sharing

Everything in the folder is shared. That is the whole permission model — there
are no per-task rules, because the folder *is* the rule.

If something should not be seen, open the page and pick **Make private** from
the ⋯ beside its title. It asks
which other folder to move it to, because moving it is the only thing that
actually makes it private. A checkbox would be a lie.

### Inviting somebody

**The areas menu, top right → Invite somebody.** Two shapes:

- **Invite file** (`join-work.md`) — the area already set up, its name and
  colour and server address, plus everything in it. They open it with *Open one
  I was sent* and they are in. Needs `grouptodo.html` at their end.
- **One file: app + area** — when you opened GroupToDo from a web address it
  can bake itself and the area into a single `.html`. They open that one file
  and nothing else, and it offers to put them straight in.

The one thing an invite cannot carry is the folder: a browser will not let a
directory handle be serialised or transferred, by design. So for a folder-backed
area the invite *names* the folder and leaves them one button to press — and
they do need the folder shared with them separately. A server-backed area needs
nothing at all, because the address travels in the file.

Separate parts of life get separate folders, called **areas** — Work, Home,
Volunteering. Two areas can never share a folder and one can never sit inside
another, so the folder you share is exactly what you meant to share. Colleagues
who get Work cannot see Home because it is not in there.

### Phones

A phone can run GroupToDo, but not from a file: phones give a page opened as a
file nowhere to save, and cannot open folders at all. So a phone needs the app
at a **web address**, and it keeps its own copy that travels as one file you
carry back and forth. See **Hosting** and **Storage and sync** below.

---
---

# Technical details

Everything past here is for whoever sets it up.

## What's in the box

```
grouptodo.html         the entire app -- open it and it runs
sw.js                  offline + Share button, when it is served from a URL
manifest.webmanifest   home-screen icon, own window, "open .md with GroupToDo"
icon.svg               that icon
index.html             two lines, so a hosted copy answers at https://host/
serve.py               optional sync server (a laptop, a Pi, a NAS, Termux)
docs/setup-sheet.html  the two-minute sheet to hand to colleagues
docs/check-in-sheet-mockup.html
                       a working mockup of the waiting-for-updates exchange
docs/lean-ui-mockup.html
                       the clickable mockup the interface was designed from
```

`grouptodo.html` alone is the whole app — named so it still means something in a
Downloads folder. `sw.js`, the manifest and the icon turn it into something a
phone keeps on its home screen; `index.html` only redirects, and `serve.py`
skips it and serves the app directly.

It began as a Neovim + org-mode + org-roam config; the status directories, the
Phys-Viz verb rule, the context links, the age tracking and the morning and
weekly rituals all survive the move.

## Running it

**As a downloaded file.** Double-click `grouptodo.html`. Works from disk, a USB
stick or a network share. On desktop Chrome and Edge this is the full app,
live folder of `.md` files included. A `file://` page may not register a service
worker, so it has no offline-open, no home-screen install and no Share button.

**From a URL.** Put the files on any static host. Nothing server-side is
required — no PHP, no Node, no database, no build:

```bash
cd GroupToDo && python3 -m http.server 8000     # then http://127.0.0.1:8000/
```

That buys *Add to Home Screen*, opening with no network at all after the first
visit, the system Share button for moving the vault file, and durable storage.
`https://host/` and `https://host/grouptodo.html` both work. Updating is a
refresh.

### What each platform can do

Capabilities are probed at runtime — **Vault & sync**, opened from the line at the
bottom of the sidebar, tells you what this device actually allows.

| | Runs standalone | Stores locally | Live folder of `.md` | Vault file out | Home screen | Opens offline |
|---|---|---|---|---|---|---|
| Windows / macOS / Linux, Chrome or Edge | yes | yes | **yes** | one-click link | served | served |
| Windows / macOS / Linux, Firefox | yes | yes | no | Save / Open | no | served |
| Android, Chrome or Edge | yes | yes | no | Share button | served | served |
| iOS / iPadOS, Safari | yes | see note | no | Share button | served | served |

"Served" means from a URL rather than a downloaded file.

**iOS note.** Safari restricts storage for pages opened from the Files app. The
app says so at startup and keeps working in memory for the session. Serving it
from a URL removes the restriction, so on iPhone and iPad that is the better
path.

I verified the Chromium behaviours directly, including the service-worker
offline cycle, the shared-file merge and a real sandboxed frame. **Safari and
Firefox I could not test** — no engine available — so those rows come from
documented behaviour, and the runtime probe is the authority on your device.

## Hosting

### A document library is not a web host

Uploading the app to a Teams channel or a SharePoint document library does
**not** give you a hosted app. Those render it inside `<iframe sandbox srcdoc>`
with no `allow-same-origin`, so the page has an opaque origin: reading
`window.localStorage` *throws*, there is no IndexedDB, no folder picker and not
even a download. It runs, so it looks like it worked, and then nothing survives
the tab. The app detects that frame and says so on the first screen instead.

The useful part of Teams is the other tab: a channel's **Files** folder is a
SharePoint folder, and channel membership is the permission model. Hit **Sync**
and it becomes a real folder in File Explorer — point an area at that.

### What a host can see

Hosting does not put your tasks anywhere. The link serves the empty app. The
whole codebase makes six network calls, all to `./api/*` on the optional sync
server, and the CSP — `connect-src 'self' http://127.0.0.1:* http://localhost:*`
— blocks every other destination, including a server address typed by hand
unless it is localhost. No analytics, no error reporting, no remote font or
script. The one way out is `/api/calendar` on your own `serve.py`, which
fetches the calendar links you added. It only fetches https links to public
addresses, and passes back nothing but iCalendar files.

A host does see the ordinary web-server trail: your IP, the time, your browser,
and which files you asked for. Not one task. Harmless for a work
list; not nothing if the point is that nobody knows you use this.

| Host | Public? | Good for |
|---|---|---|
| Company intranet, internal web folder | no — behind your login | work |
| Any static host behind a login (e.g. Cloudflare Pages + Access) | no | anything sensitive |
| A Pi or NAS on your own network, over Tailscale | no | full control |
| `serve.py` in Termux on the phone itself | no | one phone |
| GitHub Pages, Netlify (open) | the app is; your data is not | convenience |

**Desktops need no host at all.** Hosting exists for phones.

### Why not a native app?

Every other way of shipping this is an install: a per-platform build, an app
store or a signed binary, and in a corporate environment a conversation with
whoever controls MDM. A browser is the only runtime already present and already
permitted on iOS, Android, Windows, macOS and Linux at once.

The cost: no phone browser can write into a folder you choose. Only a native app
would change that, at the price of being an install.

## Storage and sync

These get confused easily, so plainly:

**Storage is a folder of markdown files.** One file per person per day in
`journals/`, one file per page in `pages/`. Desktop Chrome and Edge write them
live, as you type.

**The vault file is a courier, not a home.** One markdown file holding a copy of
the whole area, used only to reach a device that cannot open a folder — which
means every phone. Linking one does not change where your files live, and a page
the phone sends back lands as its own `.md` file in the folder.

Keep the courier **outside** the vault folder. If one ends up inside, GroupToDo
recognises it, refuses to read it as a page, and says so.

### The courier in practice

- **Desktop Chrome / Edge**: *Link vault file* once and the clicking is over. It
  merges when the area opens, merges again when you come back to the tab, and
  writes back about a minute after you stop typing — never mid-edit, and quietly
  unless it brought something in. *Sync now* forces it; *Sync by itself* turns it
  off. Needs a durable file handle, so it is desktop-only.
- **Phones, served from a URL**: *Send vault file* opens the phone's own Share
  panel, so the markdown goes straight to Dropbox, Drive, OneDrive, Nextcloud,
  Syncthing or mail. Coming back, share a `.md` **into** GroupToDo or open one
  with it from a file manager. (Share-target and file-opening are Chromium; on
  iOS share out, then *Open vault file* to bring one in.)
- **Everywhere else**: *Save vault file* and *Open vault file* use the ordinary
  browser dialogs.

**It merges rather than overwrites.** Every page carries an `updated::` stamp.
Changed on one device, the newer side wins; changed on **both**, the blocks are
merged by their text, so every addition survives and a task you ticked off
propagates instead of duplicating. Deletes travel as tombstones. Re-syncing the
same file changes nothing, so an extra sync is never a risk.

Tested: concurrent appends on two devices, check-off propagation, repeated syncs,
deletions.

### Worked example: PC and phone, through OneDrive

The asymmetry: desktop Edge writes into a folder you choose, Edge on Android
cannot — no Android browser can.

1. On the PC, **Choose folder** → `OneDrive\GroupToDo\Work`. This is your storage.
2. On the PC, **Link vault file** → `OneDrive\GroupToDo\work-vault.md`, *beside*
   the Work folder, not inside it.
3. On the phone, open the hosted URL → **Add to phone**.

| You do | What happens |
|---|---|
| Type on the PC | Your pages are rewritten at once; the courier a minute later |
| Phone: **Open vault file** → `work-vault.md` | The PC's day merges in |
| Type on the phone | Saved on the phone |
| Phone: **Send vault file** → share to OneDrive | Posted back |
| Click into the PC tab | Merges on its own; new pages appear as their own files |

OneDrive's Share panel may save `work-vault (1).md` instead of replacing it.
Harmless — merging is by content, not filename — but tidy up occasionally.

## Your own always-on machine

One machine you control serves everybody: computers and phones, live both ways,
no courier file, no cloud account, no IT ticket, and nothing for colleagues to
install.

```sh
export GTD_PASSWORD="$(head -c 24 /dev/urandom | base64)"
python3 serve.py --vault ~/OneDrive/GroupToDo/Work      # stays on localhost
tailscale serve  --bg 8777     # HTTPS, your own devices only
tailscale funnel --bg 8777     # HTTPS, anyone with the URL + the password
```

`serve.py` **refuses** to bind anything but localhost without a password, and
refuses a password under ten characters. Set it through `GTD_PASSWORD` or
`--password-file`; `--password` works and warns that it shows up in `ps`.

The check is HTTP Basic, so the browser prompts once and then attaches it to
everything — the page, `sw.js`, the manifest and the API alike. Basic encodes
rather than encrypts, so terminate TLS in front and leave the server on
localhost.

Tailscale Funnel routes by TLS server name *without* terminating, so it moves
bytes it cannot read — a different trust position from a CDN that decrypts your
traffic in order to serve it.

A server area **re-reads when you come back to the app**: it sends yours up
first and only re-reads if that succeeded, because the server is then
authoritative for everything including deletions. If the send failed the server
is behind you, so it leaves well alone and retries on a widening interval.

**Five things to know.** Running an externally reachable service on a work laptop
is probably against acceptable-use and endpoint security may block the listener.
A laptop that sleeps is offline. While you travel everyone keeps working but
nobody sees anybody else's work until you are back. One shared password is a
door, not accounts. And back up the vault — it is one folder on one machine.

### Android, in full

```sh
# Termux from F-Droid, NOT the Play Store version (that one is abandoned)
pkg update && pkg install python git
termux-setup-storage
git clone https://github.com/kennethaar/GroupTodo ~/GroupTodo && cd ~/GroupTodo
termux-wake-lock
python3 serve.py --vault ~/storage/shared/Documents/GroupToDo
```

Then open `http://127.0.0.1:8777/` and *Add to Home screen*. `serve.py` and
`grouptodo.html` must sit in the same folder; the vault is separate.

If Termux dies, the app still opens (service worker), the vault is still there
(local mirror) and edits are saved locally and sent up when it answers. Verified
end to end: killed the server, closed the tab, reopened with nothing running,
found the tasks, added another, restarted, watched it land in `journals/`.

### The local mirror

Always written *before* the real backend, so a save cannot be lost to storage
that turns out to be unreachable. How much it keeps depends on the backend:

- **Server-backed**: a **full** copy. The vault lives on the server, so when the
  server is gone the mirror is the only thing the app can open.
- **Folder-backed**: only writes the folder has not confirmed. The folder is
  already the local copy, and a full mirror there would put back anything you
  deleted in Neovim or Explorer.

### Starting over

**Vault & sync → Start afresh** empties this browser's copy of GroupToDo: every
area held in browser storage, the list of areas, your name, colours and
timezone, the linked file and server address, and the offline copy. It deletes
the `grouptodo` IndexedDB database, removes the `gtd.*` keys from
localStorage, drops the service worker's caches, unregisters the service
worker, and reloads — so the next load is the very first run again, not a stale
shell served from cache. It asks you to type *start afresh* first.

It is local only. A vault folder on disk keeps its `.md` files, a saved vault
file keeps its contents, and a sync server keeps everything — but the browser
forgets which folder it was writing into, so reconnect it afterwards. If another
tab still holds the database open, nothing is deleted and it says so.

## Corporate environments

No build step, no dependencies, no CDN, no telemetry. A Content-Security-Policy
permits no outbound connection except localhost, so the page cannot load a
script, font or image from anywhere or send data to any host but your own sync
server. Safe to drop onto a file share, an intranet or a managed laptop.

## The vault

Each area is a vault with this shape, in its own folder:

```
journals/kenneth/2026-10-05.md   one file per person per day
pages/
  _/                        cancelled projects, and the horizon pages:
                              _/Purpose.md  (H5)   _/Vision.md  (H4)
  0/  1/  2/  3/            project status: completed, active, someday, waiting
  8/                        routines, lists  -> [[8/Onboard new customer]]
  a/                        responsibilities -> [[a/Health]]       (H2)
  g/                        goals            -> [[g/Debt cleared]] (H3)
  c/                        contexts         -> [[c/phone]]
  p/  o/                    people, organisations
  z/                        zettel notes
  templates/  verbs/        templates, Phys-Viz verb lexicon
  GTD.md                    per-vault settings
```

Listed in the vault's own order: `_`, `0`, `1`, `2`, `3`, then `8`.

**Every folder explains itself.** In a folder or server area, GroupToDo puts one
small guide in each folder, named for what the letter stands for:
`pages/o/_o_for Organisations.md`, `pages/p/_p_for People.md`,
`pages/1/_1_for Active projects.md` and so on, plus
`_GroupToDo_for this folder.md` at the top. The leading underscore sorts it
first in Explorer. Each one says what goes in that folder, how the folders work
together (the folder is the kind of page and the start of its link) and how
names, dates and tags are linked as you type. The app writes them, refreshes
them when the wording changes, and never reads one as a page. Browser storage
gets none, because there is no folder to look at.

Naming yourself creates `pages/p/<Your Name>.md` with `member:: true`, which is
what tells everybody else in the area that you exist. Changing your name later
takes your things with it: the person page, your journal folder and any tasks
assigned to you all move across, while `by::` and `done_by::` stay as written —
those record who did something at the time, not who to chase now.

A project's **status is its directory**. Changing status moves the file and
rewrites every `[[1/Fix sink]]` link to `[[0/Fix sink]]`.

```markdown
title:: Fix the sink
status:: 1 = active
outcome:: Sink repaired, no drip
area:: [[a/Home]]
depends_on:: [[1/Survey the bathroom]]
updated:: 2026-10-05T09:12:00Z

- TODO Call the plumber about the leak [[c/phone]]
  Added:: [[2026-10-01]]
  SCHEDULED:: [[2026-10-08]]
  DEADLINE:: [[2026-10-15]]
- TODO Chase the quote [[c/phone]]
  assigned:: Alice
  asked:: Kenneth Aar 2026-10-02T08:30:00Z
- DONE Buy pipe tape [[c/errand]]
  Added:: [[2026-09-10]] - [[2026-09-12]] = 2 days
```

`assigned::` is who is doing it; absent means you. Somebody in the area keeps it
a live task in their name and puts it in your *Waiting for*; anybody else makes
it a `WAIT`.

`depends_on::` on a project page is the order projects have to happen in: a
comma-separated list of ordinary wiki links to the projects that must finish
first. The links resolve by slug across every status directory, so moving a
prerequisite from `1/` to `0/` does not break the chain.

`asked::` records that you sent somebody a check-in sheet about this task, and
is dropped the moment they reply.

`SCHEDULED::` is when it starts, `DEADLINE::` when it is due, and those two are
the only properties dragging a bar on the **Timeline** ever writes.

States: `TODO`, `DOING`, `WAIT`, `DONE`, `CANCELLED` (`WAITING`/`CANCELED`/`NOW`/
`LATER` read as aliases), or **no state at all** — an ordinary note.

One link does not point at a page: `[[go/todos]]` opens that part of the app
itself, with `[[go/todos][Todos]]` to label it. The doors are `todos`, `agenda`,
`context`, `people`, `projects`, `checklists`, `horizons`, `search`, `today`,
`vault`, `capture`, `review` and `keys`. The first project is written with them,
and you can use them in any task of your own; which ones you have opened is kept
per device, like "last seen", and never written to the shared files. A project
page carrying `tour:: 1` is that first project: its steps are exempt from the
verb and context nudges and are not counted as your own work, because they are
the app's scaffolding rather than your list.

Nothing is one-way. The state badge cycles `TODO → DOING → WAIT → DONE → note →
TODO`, so a line made a task by accident goes back to being a note. Dropping the
state drops the task-only bookkeeping (`Added::`, `SCHEDULED::`, `DEADLINE::`,
`CLOSED::`, `done_by::`). Cycle one click too far and nothing is lost: those
properties are held for `CFG.undoStateMinutes` (5) and put back with their
original dates if the block becomes a task again inside that window. Re-opening a
finished task clears the closing stamps, so a `TODO` never carries
`- [[end]] = 35 days`.

Already have an `.org` vault? Detected and converted on request; originals
untouched.

## The GTD nudges

The method is in the app, kept quiet until it is about something. Below six open
tasks there are no hygiene nudges at all. Everything that is worth a look is
listed on the **Weekly review** page, with a count beside it in the sidebar, and
each one can be quietened for a week.

- **Next actions must start with a filmable verb.** "Call", "draft", "buy" — not
  "think about". The lexicon is markdown in `pages/verbs/`, with synonyms.
- **Projects are outcomes**, not topics: `outcome::` asks what *done* looks like.
- **Contexts** `[[c/phone]]`, picked with a letter key.
- **Age** is tracked from `Added::` and drives "oldest first" everywhere.
- **Morning weeding** surfaces the stalest active projects. It is a step of the
  weekly review once there are 5 active projects and 20 open tasks to weed.
- **Weekly review** only becomes due once a week of actual use has passed.
- **Stuck projects**: active, with nothing actionable left. The classic trap.
- **Waiting too long**: a `WAIT` older than `CFG.waitFollowUpDays` (14).
- **People to send a check-in to**: somebody outside the area owes you
  something you have never asked about, or asked about more than
  `CFG.waitFollowUpDays` ago. Clicking it opens the sheet for them.
- **Blocked projects**: a project whose `depends_on::` prerequisite is still
  open says so on its own page, and the Timeline hatches a bar that is
  scheduled to run during something it is waiting for.

## Keys

`n` add a task · `/` search · `?` help · `\` hide or show the sidebar ·
`t` today · `g n` next · `g w` waiting for · `g p` projects · `g c` chat ·
`g r` weekly review · `g x` where are you now · `g d` re-surface ·
`v b` next as a board · `v c` calendar · `v p` project board · `v t` timeline ·
`v r` report · `v g` mind map · `v m` graph · `v d` pages as a board ·
`alt+←` / `alt+→` back and forward · `ctrl-z` undo a delete or a move ·
**Copy link** on any task or page.

On a line: `Enter` new line, `Tab` takes a suggestion or indents, `Shift-Tab`
outdents, `Ctrl-Enter` cycles the state, `Alt+T` task or note, `Alt+1` make it a
project, `Alt+D` `Alt+C` `Alt+P` `Alt+O` `Alt+J` `Alt+R` due, context, person,
organisation, project and repeat, `Alt+S` move it to another area.

## What it does about the obvious risks

**Nothing a person types is ever treated as markup.** Every title, message,
property and label goes through one escaping function before it reaches the
page; the twelve places that set HTML all read from it. Tested by actually
injecting `<img onerror>`, `<svg onload>`, `<script>`, an `<iframe>` and a
quote-breakout through task titles, message bodies, block properties, page
properties and wiki links, then walking every view: nothing executed, no
element was created, no inline handler survived.

**Lists are rationed, not unbounded.** Drawing every open task used to take
3.7 seconds at five thousand of them and 10.7 at twenty thousand, with a
quarter of a million DOM nodes. Rows are drawn 100 at a time and project
sections 100 at a time, with the headings still showing true totals: 160ms and
3,400 nodes at the same twenty thousand. The board draws 100 cards a column (12
on a phone, where they are stacked and you would otherwise scroll past the first
column to reach the second), and the graph draws the 500 best-connected pages
of what its filters leave in, says how many it left out, and draws the rest
on *Show more* or *Show all*.

Every rationed list ends in the same two buttons: **Show 100 more · 400 below**,
and **Show all 500**. The cap is there because drawing everything was slow, not
because you are not allowed to see it, so wanting the whole list costs one
press rather than five. The second button only appears when it would do
something the first one would not. Tasks, project sections, board columns,
conversations, pages, health findings and the list under the graph all go
through the same code, so it means the same thing wherever you press it.

**The whole-vault questions are asked once per render.** What is open, who is
here, where the conversations are — the sidebar alone used to ask three of them
per item, which cost 146ms a draw on a big vault. Now 6.7ms.

## Known limits

- **Block merge matches on text.** Rewording a task on one device while the other
  edits the same page reads as a delete plus an add, so you may see both. Visible
  and fixable, never silent loss.
- **Deleting a single task does not propagate** — only whole-page deletes carry
  tombstones.
- **Areas are separated, not secured.** Anyone who can open an area's folder or
  file sees all of it. No password, nothing encrypted.
- **The sync server is one shared password, not accounts.** No per-person access,
  no audit beyond the `by::` stamps.
- **A server area re-reads on return, not continuously.** No polling, no push.
- **No phone browser can write into a folder you choose.**
- **The service worker needs a URL**; a downloaded file cannot register one.
- **A document library cannot host the app** — see above.
- **Auto-sync of the courier file is desktop only** (it needs a durable handle).
- **Recurrence is offered, never scheduled.** Nothing appears until you tick the
  current one off and say yes, so a repeat you forget about simply stops.
- **The report can only count what carries a date.** A task ticked off in the
  app is stamped `done_by::` with the day; one marked DONE by hand in the file
  is not, and nothing can tell when that happened.
- **Dragging a board card is mouse only.** Touch browsers do not fire HTML5
  drag events, so on a phone the card's state buttons are the way to move it.
- **A link is only as stable as where the app lives.** Move the app to a
  different address and old links stop resolving; rename a page and a link to it
  breaks, because the path is the address.
- **A profile picture is bytes in the vault.** 24KB of base64 per person, in
  plain sight in the markdown. Small, but not nothing on a big team.
- **Last seen has an hour's resolution** and only updates when somebody opens
  the area, so it says "has this person been around", not "are they online".
- **Undo is this device, this session.** It is a five-minute grace period, not
  history: reload the page and the stack is gone.
- **Chat read state is per device.** A new device shows the whole thread as
  unread; flags, which live in the file, follow you.
- **No live calendar feed**, by choice — see above. Calendar entries are a
  snapshot taken when you press the button; changing the date later does not
  update anything already in your calendar.
- **Notifications arrive on opening the area**, not while it is closed. There is
  no server to push one, and nothing is emailed.
- **An invite cannot carry a folder.** Browsers forbid transferring a directory
  handle, so a folder-backed area needs the folder shared separately and one
  button pressed at the other end.
- **Safari and Firefox are untested by me** (see the table above).
