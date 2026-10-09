# GroupTodo

A to-do list that keeps everything as ordinary text files in a folder you
already have. Nothing to install, no account, no password, and no server.

**It is your own list first.** Almost everything anybody writes down is one
person's: you write it, you do it, you tick it off. So that is what the app is
out of the box, and nothing about working with other people is in the way until
you want it.

**And then it shares, which is the part other apps make hard.** Most task apps
keep your tasks on their servers, which is why sharing one is such a nuisance:
everybody needs an account on the same thing, somebody pays for the seats, and
adding a colleague means asking whoever administers it. GroupTodo has nothing to
be a member of. Your tasks are plain files in a folder, so you share the folder
the way you already share folders and you are done. The sharing is your
company's, not ours. See **Unlock next level collaboration**.

Either way the list outlives the tool. Every file opens in Notepad.

---

## Start in two minutes

On a computer, in Edge or Chrome:

Double-click `grouptodo.html` - nothing installs - and it asks three questions,
in this order:

1. **Who.** Your first and last name. It stamps what you write, which is worth
   nothing on your own and is the whole game the day somebody else is in the
   folder - the surname being what saves you when there are two of you called
   the same thing.
2. **Where.** *Choose folder* - OneDrive, Dropbox, Google Drive, a network
   share, anywhere your files already live. Your tasks become files in there,
   saved as you type. Skip it and everything stays in this browser until you
   decide.
3. **What.** *Start a new list*, and type your first task.

Each answer makes the next question make sense: a name is what your writing
gets stamped with, and a folder is what the first task gets written into. That
is the whole setup. Nothing asks you about people, because there are none yet.

**If you are joining a folder people already use,** the app spots what they
left for you. A colleague who put
your name on something before you arrived could only file it as a waiting-for,
because nobody here could tick it off. When you give your name, GroupTodo offers
you that pile - take them on and they become your tasks, while staying in your
colleagues' *Waiting for*, because they wrote them.

**Your first project is the tour.** The first space starts with one project,
*Find your way round GroupTodo*, and every step in it is a door: an ordinary
task whose text links straight to the part of the app it is about - Todos,
Planned, Contexts, People, Routines & lists, the weekly review, Search, and the
folder your files live in. Press the link and you are there. Come back and
GroupTodo offers to tick off the steps whose destination you have now seen - it
asks, because only you know whether looking was enough, and it never ticks one
for you. They are tasks like any others, so reword them, reorder them or delete
the lot; when the last one closes, the project files itself away like any other.

That is you set up, and on your own that is all there is to it. When you do
want somebody else in, **Unlock next level collaboration** is the chapter for
it; the short version is **Spaces → Invite somebody**, or send them
`grouptodo.html`, the name of the shared folder, and `docs/setup-sheet.html` -
the same three steps, written for somebody who does not want to know how any of
it works.

---

## How it works day to day

Nothing is hidden, but nothing appears before it is about something. The app
teaches itself as you use it.

**Your day page is yours.** Today's page is where things land when you capture
them, and it is per person, so the day two of you are in the same folder nobody
is typing over anybody.

**A task you write is yours.** No assigning, no ceremony. That is the common
case, so it costs nothing.

**States are checkboxes.** To do, Doing and Waiting for tick on and off
independently, so you can read them together or one at a time. A state nothing
is in is never mentioned.

### Six ways to look at the same list

A list answers "what next" and nothing else. Five more screens read the very
same blocks from the same markdown - none of them is a separate mode, and
anything you change in one is changed everywhere.

**Board** - four columns, To do, Doing, Waiting for and Done, with everything
closed today in the last one so it is not permanently empty. Drag a card between
columns to change its state. Ctrl-click - cmd-click on a Mac - picks cards out
without opening them, and dragging any one of the picked cards moves the whole
handful in one go; the count and a Clear button sit at the top of the board while
anything is picked. On a phone the columns stack and you open a card and use its
state buttons instead, because dragging on a touch screen fights the scroll.

The same board, one level up: the Tasks / Projects switch at the top (`v p`, or
Project board in the sidebar) swaps the four state columns for the five project
statuses - Someday/Maybe, Active, Waiting for, Completed, Cancelled. Each card
is a project, with what is open in it, whether it has a next action, what it is
blocked by and how long since it was reviewed. Dragging one into another column
does exactly what the status picker does: the file moves into `pages/<code>/`
and every link to it is rewritten - and ctrl-click works here too, so a review
that parks five projects at once is one drag.

**Calendar** - a month at a time, Monday first. Everything with a scheduled day
or a deadline lands on its day, late ones in red. Pick a day and its tasks are
listed underneath in full. On a phone the squares show coloured dots rather than
shrunken titles, and the list below is where you read them.

**Graph** - every page as a dot, every `[[link]]` as a line, pushed apart and
pulled together until it settles, so what you write about together ends up near
each other without anybody filing it. A bigger dot has more links. A hollow dot
is a link to a page nobody has made yet - `[[c/phone]]` written in fifty tasks
long before `pages/c/phone.md` exists - and clicking one makes it, exactly as
clicking the link in a task does. Under the picture, the same pages as an
ordinary list, because a canvas means nothing to a keyboard or a screen reader.

**Mindmap** - a second reading of the graph rather than a sixth screen: the
**Mindmap** button on the graph swaps to it and **Whole map** swaps back, and
the graph remembers which you were last using. It is the same links read the
other way round. The map answers "what
does all of this look like"; it is bad at "what is around *this*", because the
page you care about is wherever the physics left it and everything else is drawn
at the same weight. So the mindmap puts one page in the middle, what points at
it above, what it points at below, and what shares a parent out to the sides.
Their own neighbours form a small faint outer ring, which is the whole of the
2.5D: size and opacity standing in for distance, with everything gliding instead
of jumping so you can see where a thing went when the middle changes. A click
moves the middle. A double-click opens a card about that page without leaving
the picture, which is the point of the thing: you keep your place while you look
around.

**The tasks are on it too.** The map is about pages, so pages are all it draws;
the mindmap is about getting somewhere, and the place you are usually getting
to is a task. So it hangs the tasks off the pages: a page's tasks below the
page, a task's sub-tasks below the task. A round dot is a page, a square dot is
a task coloured by its state, and a closed task is drawn hollow rather than
dropped, because a branch that empties as you finish it reads as the work
vanishing instead of as progress. Zooming into a project is therefore the same
gesture as every other move on the screen: put it in the middle and its actions
are the fan underneath, put one of those in the middle and its sub-actions are.
Past a dozen children on one dot the rest are counted in the label rather than
drawn.

**The keyboard drives it.** Arrow keys walk to the nearest dot in that
direction - down from a project walks into its actions, the sides are its
siblings, up is what points at it. **Enter** centres on the dot you are on, and
**Enter** again, now that you are on the middle, adds a step under it: a
sub-action under a task, a next action under a project, a new linked page under
anything else. **Backspace** goes back up to what points here. **Space** edits
the dot you are on - a task's line, links and all, or a page's name - because
the mindmap is where you think and a thought you cannot correct without leaving
the picture is a thought you leave wrong; **o** opens the page or task instead.
The dot the keyboard is pointing at carries a dashed ring, so it is never a
guess which one **Enter** will take.

A step added here is filed in the context you are standing in: say you are in
`@phone` and the next action you hang off a project is a phone call, so it is
written `[[c/phone]]` without being asked. The toast says so and carries one
button for the times it does not belong there. Ignore it and nothing happens,
which is the point of saying it in a toast rather than a dialog.

Names are drawn so they do not collide: every dot reserves its own space first,
a name hangs overhead for what points here and underfoot for what this points
at, and one that still cannot find room is left out rather than written across
its neighbour - walking onto that dot, or pointing at it, shows it. A side with
more than six dots on it is dealt into two arcs at different distances for the
same reason.

**Edit** turns the mindmap into somewhere you can build. Drag one dot onto
another and they are linked. Drag a dot out into empty space, or double-click
empty space, and you name a new page which is born linked to the one in the
middle, so it is never an orphan nobody can find again. A relation is a
`[[link]]` under a `Related` block in the markdown and nothing else: no second
copy, no database, and it reads as a list of links in any editor. **Unlink** in
the list underneath takes one out again, and a link inside a sentence loses the
brackets rather than the sentence.


### Where a todo sits

Open any todo and the first thing in the panel is its surroundings: three
columns and four rows, the same few facts the file already holds, placed rather
than listed so the shape reads in one look. Down the middle, the project it
belongs to, its parent line, and the todo itself. Along the bottom, its
children. First column, its tags, with the context at the top because that is
the one that decides whether you can do the thing where you are standing.  Last
column, level with the todo, its siblings.

Every cell is a way in: a sibling or a child opens in the same panel, the
project opens its page, a tag follows the link.

The project is whichever the line says it is: a `[[1/project]]` link on the todo
wins, then one on the line above it, then the line above that. Writing

```markdown
- [[1/Rewire the workshop]]
  - TODO Pull the cable
```

in today's page is how most todos get captured, and the project is the point of
writing it that way. Indentation is inheritance, however deep it goes, so a line
five levels down still belongs to the project it was written under. Only when no
line above says otherwise does the page the todo lives on answer, which for a
journal capture is the day.

A project link indented under another project link is a milestone inside it,
which is how a plan with stages gets written in a file that has no idea what a
stage is:

```markdown
- [[1/Rewire the workshop]]
  - [[1/First fix]]
    - TODO Pull the cable
  - [[1/Second fix]]
    - TODO Dress the board
```

The nearest link answers "what is this part of" and the ones above it are the
plan it is part of, so the cell reads outermost first and the project column
reads downward the way the plan nests: the project, its milestone, the line
above this one, this one. The outer ones are drawn quieter, because the setting
is not the thing. A line written as nothing but a project link is scaffolding
rather than a parent, so the parent cell skips past it instead of printing what
the cell above it just printed.

The links in a title are read out, not taken out. A todo is often mostly links,
and "Ring about the quote" with the person and the org removed is a line you
cannot pick out of a row of six. The brackets go; the words stay.

`Esc` hands the panel over to the grid. The arrows then walk from node to node
and `Enter` centres on the one you land on, so the whole of it is reachable
without the mouse. The middle is a node too, and `Enter` there is the one thing
moving cannot do: it adds a step under whatever you are looking at, and centres
on the new one so you can keep going. Two presses, two meanings, and neither is
a key to remember separately. On a project, the same press adds the next action.

The traversal is animated. One ring slides from node to node rather than
teleporting, so the arrows read as movement through a place, and a re-centre
measures where every node was, puts it back there and releases it, so the grid
visibly rearranges itself around your choice instead of cutting to a new
layout. Both stand down under `prefers-reduced-motion`. Movement is geometric, the nearest node in the direction you
pressed, which is why it still works on a phone where the same cells stack into
one column. A second `Esc` closes the panel as it always did, so select mode
costs one extra press and takes nothing away.

A project gets the same grid one storey up: the area it serves above its status
above the project, its own todos along the bottom, the tags it links to in the
first column, and the other projects in its area beside it. Same three columns,
same four rows, same keys, so there is one thing to learn and not two. Nothing in it is computed or
stored. The project is the page the line lives on, the parent and siblings and
children are the indentation, and the tags are the `[[links]]` in the title, so
a line with nothing around it says so rather than showing an empty box.

**Timeline** - a Gantt: every project as a bar from the day its first task
starts to the day its last one ends, with its tasks underneath when you open
it. A bar is drawn from what the file already carries - `SCHEDULED::` or the
day it was captured for the start, `DEADLINE::` or the day it was ticked off
for the end, and today for anything still running. A project goes red, and
says *late*, as soon as anything open inside it has run past its end, so you
do not have to open it to find out. A task with no date at all gets no bar: it
is counted underneath instead, because an invented span reads exactly like a
real one.

**Bars move.** Drag one along to reschedule it, drag either end to change when
it starts or when it is due, and drag a *project* bar to take the whole project
with it - every open, dated task inside keeps its shape and shifts together.
The dates follow the pointer while you drag, and nothing is written until you
let go, so a drag across three months is one edit to the file rather than
ninety. A drag only ever writes `SCHEDULED::` and `DEADLINE::`, which is where
the plan already lived; `Added::` is history and is never rewritten, so a task
captured in March that you push to May still says it was captured in March.
Closed tasks have no handles: their end is the day somebody ticked them off,
and dragging that would be editing the past. On a keyboard, focus a row and use
`Alt+←` / `Alt+→` to move it a day, with `Shift` for a week.

**Report** - what actually got finished, over the last month, quarter, two
quarters or year, filterable by person. It reads `done_by::`, which is stamped
on the tick, so nothing new is recorded to make this work; the rows are grouped
by month, because that is the shape a report is read in. **Copy as text** puts
it on the clipboard grouped by project, ready to paste into a status mail or a
stand-up note. Tasks marked DONE by hand in the file carry no date, so they
cannot be placed in a window - the count of those is shown rather than quietly
dropped.

The five screens are in **Views** in the sidebar, or `v b`, `v c`, `v g`,
`v t` and `v r` - but only once there is something for them to be about. See
below. The mindmap is not a sixth entry: it is a button on the graph screen,
and the graph remembers which of the two you were last using.

### The menu only shows what your files actually have

A menu of twenty screens, eighteen of which say "nothing here yet", is a menu
that teaches you to ignore it. So every entry earns its place from the files:
no dated task, no **Timeline** and no **Calendar**; no `[[links]]`, no
**Graph**; nothing finished, no **Report**; an empty status folder is not
listed at all. **People** appears when somebody else does, **Chat** when there
is one. Each check stops at the first hit rather than counting, and the answers
are worked out once per redraw.

The one exception is the screen you are standing on: it never disappears from
under you, or ticking off your last dated task would strand you on a Timeline
with no way back to it.

### `[[` opens a list of pages

The prefix in a link is the folder the page lives in, so `[[c/` can only mean a
context and `[[p/` can only mean a person. That is knowledge the app already has
and you should not have to carry: typing `[[` lists everything, typing a prefix
narrows it to that kind, and typing more narrows it further. Arrows move,
`Enter` or `Tab` accepts, `Escape` closes and leaves your text alone.

It writes nothing by itself. Accepting a row inserts exactly the `[[ref]]` you
could have typed by hand, and a name no page has yet is offered last, as **Make
c/loftet** - the page is created the same way it always was, when the line is
saved. The list works in the outliner, in the add-a-task box and in Capture.

### A list you paste stays a list

A list of tasks hardly ever starts life here. It arrives in a mail, in the
minutes of a meeting, in a message from somebody who writes them down the way
they think of them - and the only thing standing between that and your list is
retyping it. So paste it. The second line is what gives it away: one line is
still text going in where the caret is, and from two lines up it is a list, and
every line of it becomes a task of its own.

```
- TODO #pri1 [[o/CAB MEPS]] Verifisere MEPS data update
- TODO #pri4 [[o/CAB MEPS]] [[o/CAB DigiCare]] Verifisere PDF- og beslutningsopplasting
- TODO #pri2 [[o/CAB MEPS]] Tilgjengelig organisasjonsnummer
```

Three tasks, not three lines in one. The marks in front of the words are the
list's own and not part of the task: a leading `-` is a bullet, indentation is
nesting, a leading `TODO` or `DONE` is the state, and an indented `key:: value`
line belongs to the task above it - so a block copied out of GroupTodo, dates
and names and all, pastes back whole. The `[[o/CAB MEPS]]` in there is an
ordinary link, so the org pages it names are created on the way in, exactly as
if you had typed them.

A line that says nothing about its own state becomes whatever the place it
lands in says an unmarked line is: a task in the add-a-task box and in Capture,
and in the outliner whatever the block you pasted into was. That is the rule
that lets a bare list of five lines with no `TODO` in sight still become five
tasks, without a paste into the middle of a note turning the note into one.

It works in the outliner, in the add-a-task box - which is a one-line field, so
without this the line breaks would simply be thrown away - and in Capture.

### Pictures and files you drop on a line

A note is not always words. Drag a screenshot, a photograph, a PDF or anything
else onto a line in the outliner - or copy a picture and paste it there - and
the file is written into an `assets` folder inside the very folder your tasks
live in, the way Logseq and Obsidian do it. The line gets an ordinary markdown
link to it:

```
- TODO Fix the boiler ![boiler.jpg](assets/boiler-20261009-142233.jpg)
- Quote from the plumber [quote.pdf](assets/quote-20261009-142305.pdf)
```

A picture shows itself in the line and opens full size when you click it;
anything else is a link that opens the file. The name is kept, tidied, and
stamped with the moment it arrived, so a second `image.png` never lands on top
of the first. Nothing is uploaded anywhere: the file sits next to the markdown
that mentions it, so the folder you share carries the picture along with the
task, and both halves still read in any other editor that opens the folder.

If the space has no folder yet - everything still in the browser - the file is
kept in the browser alongside the tasks and the app says so, which is enough to
go on with but is not a file anybody else can open. Choose a folder and dropped
files become real files in `assets` like everything else.

### Enter splits a line

Pressing `Enter` in the outliner cuts the line at the caret: what is behind it
stays where it is and what is in front of it goes down into the new block. At
the end of a line, which is where `Enter` usually gets pressed, that is the
same empty new block it always was. At the very start of a line it opens an
empty block above and leaves the line alone, rather than emptying it and
carrying its words down.

### Focus

The button beside Capture, or `f f`. The same screen with everything that is
not the work taken away: no sidebar, no nudges, no counts, no filter chips, and
the column narrows to a readable measure. Row actions fade in when you reach a
row. Escape, or the button again, brings it all back. It is per device, like
the theme, because wanting a quiet screen is about where you are sitting rather
than about the work.

### Advanced reads as text

Advanced is the outliner half, and an outliner is a text file you can see. So
the chrome that helps in Simple gets out of the way: rows flatten to lines, the
cards lose their boxes, state badges become the bare words `TODO` and `DOING`,
and the type goes monospace where the file itself would be. Same data, same
files, one keypress apart.

### Projects that have to happen in order

The survey comes before the drawings, the drawings before the quote. Until you
write that down it lives in somebody's head, and a project sits at the top of
*Active* looking perfectly startable while the thing it actually waits on has
not been touched.

On any project page: **nothing comes first** (or **after …**, once there is
something) opens a list of your other projects. Tick what has to finish first.
It is saved as one line of ordinary markdown:

```
depends_on:: [[1/site-survey]], [[1/planning-permission]]
```

That is all of it, so the order travels with the files and reads fine in
Notepad. A project that would end up depending on itself, however long the way
round, is not
offered; the cycle check runs before the list is drawn rather than after you
have saved.

What it then buys you:

- The project page says **blocked by Site survey** while a prerequisite still
  has anything open, and **N projects waiting on this** on the other side of
  the arrow.
- On the **Timeline**, prerequisites are joined to what they gate with an
  elbowed arrow, and a marker sits on the track at the first day the chain
  allows the project to start. If the bar starts before that marker, the
  overlapping part is hatched and the arrow turns red - it is scheduled to
  happen during something it is supposed to be waiting for.
- Drag a project bar and anything downstream that no longer fits offers to
  move with it: *"2 projects downstream now start too early - push them
  along"*. Offered, never done quietly. Moving your own project is your
  decision; moving four more is a different decision.
- The **starts N days too early** button on the project page pushes just that
  one project clear of what it waits on.

A prerequisite counts as cleared when it has nothing open left, or once it is
filed as completed or cancelled. *Someday/maybe* does **not** clear it - a
project waiting on something nobody intends to start is exactly what you want
told about.

### Linking to a task from anywhere else

"Did you correct the colours on the rollup?" is a sentence somebody types in
Teams, in an email, in a text. **Copy link** - on a task, or on any page - gives
them a way back to the exact thing.

```
https://your-host/grouptodo.html#gt&s=Work&p=pages%2F1%2FRollup.md&b=4bnggdod
```

Space, file and block. Opening it switches space if it needs to, opens the page
and pops the task itself. A link to something this vault does not have says so
rather than landing you nowhere.

Block ids are regenerated every time a file is parsed, so copying a link is the
one moment a durable one is needed: it stamps `id::` on that block, in the
markdown like everything else.

Links work best when the app is served from a URL, since then everybody has the
same address. From a downloaded file the link still works for anyone whose copy
sits at the same path, and the dialog says so rather than pretending.

### Undo

Deleting was one click and permanent. Now a delete offers **Undo** in the toast
for twelve seconds, `ctrl-z` works for five minutes, and both put the thing back
where it was - a task into its old position with its thread intact, a page with
its tombstone lifted so the next sync does not quietly delete it again
everywhere else.

What is kept is the removed thing itself, not a snapshot of the page: restoring
a whole page would discard anything else that changed on it meanwhile, which is
a worse bug than the one being fixed.

### Things that come back

A task can carry `repeat:: weekly` - or `monthly`, `every 2 weeks`, `every
monday`, whatever you write in the file. **Nothing is created until you tick the
current one off, and even then you are asked.**

That is the whole design. A scheduler fills your list while you are away and
hands you a wall of overdue chores on the Monday; this does not. Skip a week and
you have skipped a week - there is no backlog of imaginary Mondays. Ticking one
off late still puts the next one in the future, never in the past, and a monthly
job on the 31st lands on the 28th in February rather than rolling into March.

The next one carries the title, the repeat and who it is assigned to, and leaves
behind what belonged to that one doing of it - the dates, the done stamp.

### Dates in your calendar

Anything with a date gets **Add to calendar**, and **Planned** sends the whole
window at once. Two routes, deliberately different:

- **A file** (`.ics`) is built on your machine and goes nowhere. Works with every
  calendar, including desktop Outlook and Apple, and works offline.
- **A link** opens Outlook's or Google's own new-event screen with the fields
  filled in - one click instead of download-then-import, at the cost of the title
  and date travelling in the web address. Fine for a meeting; worth a thought for
  anything private.

Your choice is remembered, per device. **Nothing is ever subscribed**: a live
feed is fetched by Microsoft's and Google's servers, so it would mean the whole
list sitting at a publicly reachable URL protected by nothing but obscurity. The
app has no such thing and no way to make one.

### Phones

A phone can run GroupTodo, but not from a file: phones give a page opened as a
file nowhere to save, and cannot open folders at all. So a phone needs the app
at a **web address**, and it keeps its own copy that travels as one file you
carry back and forth. See **Hosting** and **Storage and sync** below.

---

## Unlock next level collaboration

**Almost every task is one person's.** You write it, you do it, you tick it off,
and nobody else is involved, which is true of practically everything on
practically everybody's list. So none of what follows is in your way until you
want it: no assigning, no inbox, no permissions, and no second person implied by
a screen sitting there empty. A list with one person in it looks like a list for
one person.

When a second person does arrive, this is what opens up.

### One task, two points of view

The whole of the model is this: **a task you hand over becomes their todo and
stays your waiting-for.** Not a copy you both keep up to date, and not a message
you then have to chase. One line, in one file, read from two ends.

- On **their** side it is an ordinary task on their list, in their contexts,
  with their name on it. They tick it off the way they tick anything off.
- On **your** side it leaves your list and appears in **Waiting for**, which is
  the honest place for it: it is no longer something you do, it is something you
  are owed.
- When they tick it, it is done for both of you. There is no second tick, no
  status to reconcile and no way for the two views to disagree, because there is
  only ever the one line.

**Hand one over and it tracks itself.** Give a task to somebody in the space and
it becomes theirs - and appears in your *Waiting for*. One task, two points of
view, never two copies, so ticking it off once is enough for both of you.

**Name somebody outside the space** and it becomes a plain waiting-for instead,
because they cannot see it and cannot tick it off. Calling that a task would be
a lie.

**People** appears once there is more than you. *Waiting for* only tells you what
you handed over; this tells you what everyone is carrying. Click a name to see
their projects and open work.

### And then you can talk about it

A task carries its own thread, so the conversation about a thing lives on the
thing instead of in a chat window where neither of you will find it again in
March. It is the same markdown underneath: a reply is an indented line with a
`msg::` and a timestamp, which reads as a conversation in any editor. **Talking
on a task**, below, is the detail.

**You are told what you missed.** There is no server to push a notification, so
the app looks for itself: open a space and it tells you what happened since you
last did - work somebody handed you, and work you handed over that is now
finished. Click one to go straight to it. "Last seen" is per device and never
written to the shared files, so marking your own news read does not mark it read
for everybody.

### What you have to set up for any of this

Nothing in the app. The sharing is your company's: put the folder somewhere two
people can both reach, which is exactly what OneDrive, a network share or
Dropbox already do. There is no server here to be a member of, so there is
nobody to invite, nobody to pay a seat for, and nothing to be removed from
except the folder.

### Waiting for an update from somebody who does not use this

Half of a shared list is work other people owe you, and most of those people
are not in your folder and are not going to be. *Waiting for* already knew what
they owed; what it could not do was ask. So you wrote the same mail by hand
every fortnight, pasted four task titles into it, and typed the answers back in
one task at a time.

One file does the round trip now. There is [a mockup of the whole
exchange](docs/check-in-sheet-mockup.html) - open it in a browser and tap the
rows.

1. **Ask.** **People** → the person → **Ask … for an update**. Everything open
   with their name on it is already listed and already ticked. Untick anything
   you would rather not raise, and press **Make the sheet**.
2. **Send.** You get `grouptodo-check-in-mia-halvorsen.html` - one
   self-contained page, no network, no libraries, no fonts to fetch - and a
   covering note to send it with, in your own voice, ready in your email or in
   Teams - **Open in email**, **Send in Teams**, or **Copy**, in English or
   Norwegian. You attach the file yourself; no link of any kind can do that for
   you. The note names the actual things you are waiting on, because a stranger
   could not have known them, and that is what tells the person the mail is
   really from you - an HTML attachment from somebody is shaped exactly like a
   phishing mail. It also says outright that they can ignore the attachment and
   just reply in words. A request nobody is allowed to refuse is a request
   people learn to ignore.
3. **They tick.** They double-click it and it opens in whatever browser they
   have. One tap per thing they finished, a note where a note is worth typing,
   then one button. That writes a small markdown file - readable in any editor,
   so it survives being pasted into the body of an email. Their ticks are kept
   in their browser, so closing it halfway through costs nothing.
4. **Import.** Their answers usually arrive as the body of an email, not as a
   file, so the ordinary route is **Paste a reply**: select the message, copy
   it, drop it in. **Import a file** is there for when they did send one. Either
   way you get a review listing exactly what will change, with every row
   droppable, before anything is applied.

Applying it closes the tasks they ticked, stamped `done_by:: Mia Halvorsen`,
and files their notes as ordinary comments on the tasks **in their name**, so
the thread reads like they said it - because they did. Anything they left
unticked is left alone.

**The sheet is not a copy of your vault.** It carries the lines you chose and
nothing else: no project names, no colleagues, no other tasks, no files.
Somebody forwarding it leaks four sentences, not a space. It also never needs
an account, a login or a server - the same bargain as the rest of GroupTodo.

Sending one stamps `asked:: <your name> <when>` on each task, so *People* can
tell you *"3 things owing · asked 11d ago"* rather than making you remember,
and the nudge **people to send a check-in to** counts anybody who has gone
quiet past the two-week mark. The stamp is dropped the moment they answer:
"asked and heard nothing" is the thing worth measuring, and once they have
replied there is nothing outstanding to measure.

### Faces, and who has been here

**One name and one photo per space.** Both belong to that space alone: the name
is kept on this device, the photo in your own page inside that vault, so Work and
Private can show different ones and neither follows you between them.

**Add a photo of yourself** in **Vault & sync**, beside your name - or click
your own face in People. It opens the ordinary file picker, which on a phone
offers the camera or your photo library.

The picture lives in your own person page as a `data:` URI, so it travels in the
vault like everything else: no upload, no server, nowhere else for it to go
missing. It is redrawn at 96px and the quality stepped down until it fits a hard
24KB ceiling - a 470KB, 1200×900 photo comes out at about 2KB of text. No
picture means initials in a colour derived from your name, stable everywhere.

**`last_seen::`** on the same page answers "has anybody even opened this
lately". It is written at most once an hour, so it does not churn the file, and
shows up in People (*last seen 3 hours ago*, *here now*) and beside a name in
chat. A space with `no_attribution:: true` records this too - same promise.

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

**The thread reads as a conversation.** Bubbles - yours on the right, theirs on
the left - with the name, the time and *last seen* sitting **outside** the
bubble, because a bubble holds what was said. A face per speaker, a run of
messages from one person under one name, day separators, times you can use
(`8:30 AM`, `Yesterday 2:02 PM`, `Mon`), and one `New` line where the unread
starts rather than tinting everything.

**Read is per device and never written to the vault** - you reading something
must not mark it read for everybody. Rows show `○ 2 new` while anything is
unread.

**A flag is the opposite.** `flagged_by::` carries your name in the file, so what
you flagged follows you between devices and your colleagues can see you have
picked it up.

**Chat** gathers every thread you have - across every space you are showing,
every project and every day page - newest first, with the task it belongs to,
who spoke last and what they said. Filter it by *All*, *Unread* or *Flagged*;
click a row and you land on the task itself, switching space if it lives in
another one. The nav entry appears once there is a conversation to find.

New messages on tasks you are part of also turn up in the arrival notice.

### Sharing, and not sharing

Everything in the folder is shared. That is the whole permission model - there
are no per-task rules, because the folder *is* the rule.

If something should not be seen, open the page and use **make private**. It asks
which other folder to move it to, because moving it is the only thing that
actually makes it private. A checkbox would be a lie.

### Inviting somebody

**Spaces → Invite somebody.** Two shapes:

- **Invite file** (`join-work.md`) - the space already set up, its name and
  colour and server address, plus everything in it. They open it with *Open one
  I was sent* and they are in. Needs `grouptodo.html` at their end.
- **One file: app + space** - when you opened GroupTodo from a web address it
  can bake itself and the space into a single `.html`. They open that one file
  and nothing else, and it offers to put them straight in.

The one thing an invite cannot carry is the folder: a browser will not let a
directory handle be serialised or transferred, by design. So for a folder-backed
space the invite *names* the folder and leaves them one button to press - and
they do need the folder shared with them separately. A server-backed space needs
nothing at all, because the address travels in the file.

Separate parts of life get separate folders, called **spaces** - Work, Home,
Volunteering. Two spaces can never share a folder and one can never sit inside
another, so the folder you share is exactly what you meant to share. Colleagues
who get Work cannot see Home because it is not in there.

A new space is asked one question: what it is for. A whole life runs all six
altitudes, purpose and vision included. A job runs the same six, but the top two
are the organisation's mission and its strategy - written down rather than
invented, and never nagged about, because a job is not the thing that decides
why you are here. One project or a volunteer role stops at goals and borrows the
rest from the life it sits in. It is a per-space answer, kept in that space's own
`GTD.md`, changeable any time in Vault & sync, and nothing is ever deleted by
changing it: an altitude a space does not run is simply not shown.

---

# Technical details

Everything past here is for whoever sets it up.

## What's in the box

```
grouptodo.html         the entire app -- open it and it runs
sw.js                  offline + Share button, when it is served from a URL
manifest.webmanifest   home-screen icon, own window, "open .md with GroupTodo"
icon.svg               that icon
index.html             two lines, so a hosted copy answers at https://host/
serve.py               optional sync server (a laptop, a Pi, a NAS, Termux)
docs/setup-sheet.html  the two-minute sheet to hand to colleagues
docs/check-in-sheet-mockup.html
                       the waiting-for-updates exchange, end to end, with the
                       real check-in sheet running in the page
```

`grouptodo.html` alone is the whole app - named so it still means something in a
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
required - no PHP, no Node, no database, no build:

```bash
cd GroupTodo && python3 -m http.server 8000     # then http://127.0.0.1:8000/
```

That buys *Add to Home Screen*, opening with no network at all after the first
visit, the system Share button for moving the vault file, and durable storage.
`https://host/` and `https://host/grouptodo.html` both work. Updating is a
refresh.

### What each platform can do

Capabilities are probed at runtime - **Vault & sync** tells you what this device
actually allows.

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

### Opening a fresh download

A page opened from a downloaded file keeps no folder permission between visits,
so every new copy of `grouptodo.html` starts out without access - even though
the folder itself is still remembered. GroupTodo asks for it back on the way in:
one dialog, one button naming the folder, no picker to walk. Say *Allow* and the
space re-reads its `.md` files; say *Not now* and it works in browser storage
until you reconnect it from **Vault & sync**. The linked vault file is the same -
the file stays linked, and **Sync** asks for permission on the click you were
making anyway.

When a folder really does have to be chosen again, the picker opens on the one
the space last used rather than at Documents.

I verified the Chromium behaviours directly, including the service-worker
offline cycle, the shared-file merge and a real sandboxed frame. **Safari and
Firefox I could not test** - no engine available - so those rows come from
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
and it becomes a real folder in File Explorer - point a space at that.

### What a host can see

Hosting does not put your tasks anywhere. The link serves the empty app. The
whole codebase makes six network calls, all to `./api/*` on the optional sync
server, and the CSP (`connect-src 'self' http://127.0.0.1:* http://localhost:*`)
blocks every other destination, including a server address typed by hand
unless it is localhost. No analytics, no error reporting, no remote font or
script.

A host does see the ordinary web-server trail: your IP, the time, your browser,
and which files you asked for. Not one task. Harmless for a work
list; not nothing if the point is that nobody knows you use this.

| Host | Public? | Good for |
|---|---|---|
| Company intranet, internal web folder | no - behind your login | work |
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
the whole space, used only to reach a device that cannot open a folder - which
means every phone. Linking one does not change where your files live, and a page
the phone sends back lands as its own `.md` file in the folder.

Keep the courier **outside** the vault folder. If one ends up inside, GroupTodo
recognises it, refuses to read it as a page, and says so.

### The courier in practice

- **Desktop Chrome / Edge**: *Link vault file* once and the clicking is over. It
  merges when the space opens, merges again when you come back to the tab, and
  writes back about a minute after you stop typing - never mid-edit, and quietly
  unless it brought something in. *Sync now* forces it; *Sync by itself* turns it
  off. Needs a durable file handle, so it is desktop-only.
- **Phones, served from a URL**: *Send vault file* opens the phone's own Share
  panel, so the markdown goes straight to Dropbox, Drive, OneDrive, Nextcloud,
  Syncthing or mail. Coming back, share a `.md` **into** GroupTodo or open one
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
cannot - no Android browser can.

1. On the PC, **Choose folder** → `OneDrive\GroupTodo\Work`. This is your storage.
2. On the PC, **Link vault file** → `OneDrive\GroupTodo\work-vault.md`, *beside*
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
Harmless - merging is by content, not filename - but tidy up occasionally.

## Your own always-on machine

One machine you control serves everybody: computers and phones, live both ways,
no courier file, no cloud account, no IT ticket, and nothing for colleagues to
install.

```sh
export GTD_PASSWORD="$(head -c 24 /dev/urandom | base64)"
python3 serve.py --vault ~/OneDrive/GroupTodo/Work      # stays on localhost
tailscale serve  --bg 8777     # HTTPS, your own devices only
tailscale funnel --bg 8777     # HTTPS, anyone with the URL + the password
```

`serve.py` **refuses** to bind anything but localhost without a password, and
refuses a password under ten characters. Set it through `GTD_PASSWORD` or
`--password-file`; `--password` works and warns that it shows up in `ps`.

The check is HTTP Basic, so the browser prompts once and then attaches it to
everything - the page, `sw.js`, the manifest and the API alike. Basic encodes
rather than encrypts, so terminate TLS in front and leave the server on
localhost.

Tailscale Funnel routes by TLS server name *without* terminating, so it moves
bytes it cannot read - a different trust position from a CDN that decrypts your
traffic in order to serve it.

A server space **re-reads when you come back to the app**: it sends yours up
first and only re-reads if that succeeded, because the server is then
authoritative for everything including deletions. If the send failed the server
is behind you, so it leaves well alone and retries on a widening interval.

**Five things to know.** Running an externally reachable service on a work laptop
is probably against acceptable-use and endpoint security may block the listener.
A laptop that sleeps is offline. While you travel everyone keeps working but
nobody sees anybody else's work until you are back. One shared password is a
door, not accounts. And back up the vault - it is one folder on one machine.

### Android, in full

```sh
# Termux from F-Droid, NOT the Play Store version (that one is abandoned)
pkg update && pkg install python git
termux-setup-storage
git clone https://github.com/kennethaar/GroupTodo ~/GroupTodo && cd ~/GroupTodo
termux-wake-lock
python3 serve.py --vault ~/storage/shared/Documents/GroupTodo
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

**Vault & sync → Start afresh** empties this browser's copy of GroupTodo: every
space held in browser storage, the list of spaces, your name, colours and
timezone, the linked file and server address, and the offline copy. It deletes
the `grouptodo` IndexedDB database, removes the `gtd.*` keys from
localStorage, drops the service worker's caches, unregisters the service
worker, and reloads - so the next load is the very first run again, not a stale
shell served from cache. It asks you to type *start afresh* first.

It is local only. A vault folder on disk keeps its `.md` files, a saved vault
file keeps its contents, and a sync server keeps everything - but the browser
forgets which folder it was writing into, so reconnect it afterwards. If another
tab still holds the database open, nothing is deleted and it says so.

## Corporate environments

No build step, no dependencies, no CDN, no telemetry. A Content-Security-Policy
permits no outbound connection except localhost, so the page cannot load a
script, font or image from anywhere or send data to any host but your own sync
server. Safe to drop onto a file share, an intranet or a managed laptop.

## The vault

Each space is a vault with this shape, in its own folder:

```
journals/kenneth/2026-10-05.md   one file per person per day
pages/
  _/                        the horizon pages:
                              _/Purpose.md  (H5)   _/Vision.md  (H4)
  -/                        cancelled projects
  0/  1/  2/  3/            project status: completed, active, someday, waiting
  8/                        routines, lists  -> [[8/Onboard new customer]]
  a/                        areas of focus   -> [[a/Health]]       (H2)
  g/                        goals            -> [[g/Debt cleared]] (H3)
  c/                        contexts         -> [[c/phone]]
  p/  o/                    people, organisations
  z/                        zettel notes
  templates/  verbs/        templates, Phys-Viz verb lexicon
  GTD.md                    per-vault settings, including horizon_profile
```

Listed in the vault's own order: `-`, `0`, `1`, `2`, `3`, then `8`. Horizons sit
in `_/` on their own; cancelled is `-`, struck out, so your purpose and a project
you gave up on no longer share a drawer. A vault written before that moves itself
on first open.

Naming yourself creates `pages/p/<Your Name>.md` with `member:: true`, which is
what tells everybody else in the space that you exist. Changing your name later
takes your things with it: the person page, your journal folder and any tasks
assigned to you all move across, while `by::` and `done_by::` stay as written -
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

`assigned::` is who is doing it; absent means you. Somebody in the space keeps it
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
`LATER` read as aliases), or **no state at all** - an ordinary note.

**A link you type is a page you meant.** Write

```
TODO Answer the calculation decision [[c/computer]] [[p/Niclas Ojebrandt]] [[1/Userflow - low hanging fruit]]
```

in a quick-add box, in Capture, in the outliner or in an action's Title, and the
pages behind it are made as the line is saved - `pages/1/Userflow - low hanging
fruit.md` as an active project, `pages/p/Niclas Ojebrandt.md` as a person,
`pages/c/computer.md` as a context - from your templates if you have them. It
says which ones it started. The line itself is left exactly as you typed it and
stays in the day page you wrote it in, while the project now carries it: it
shows on the project page, counts towards the project's *N open* in **Projects**,
and is why the project is not nagged at for having no next action. So a project
starts the moment you need one, in the middle of a sentence, and nothing is left
behind as a broken link for the health check to find weeks later. Only the
prefixed links make pages - `[[1/...]]`, `[[2/...]]`, `[[3/...]]`, `[[0/...]]`,
`[[-/...]]`, `[[_/...]]`, `[[8/...]]`, `[[p/...]]`, `[[o/...]]`, `[[c/...]]`, `[[a/...]]`,
`[[g/...]]`, `[[z/...]]` - and a date link or a plain `[[note]]` makes nothing,
because neither says where it would live. Anything already there is opened, not
replaced.

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
tasks, simple mode shows no hygiene nudges at all.

- **Next actions must start with a filmable verb.** "Call", "draft", "buy" - not
  "think about". The lexicon is markdown in `pages/verbs/<lang>/`, with
  synonyms, and it ships in **English and Norwegian**: half the people this is
  for write their tasks in Norwegian, and a lexicon that only knew English would
  quietly mark every one of their lines as verbless. The picker has a tab for
  each, English first, and remembers which one you work in.

  It also learns. The picker lists **the words already in the task** and
  teaching it one is a press: *Grav* becomes a verb, that line counts, and so
  does every line like it from then on. Nothing is rewritten. When the word you
  pick is not the first word, it is still learned and the line is handed back to
  you to reword, because shuffling a word to the front turns "Kabelen må
  trekkes gjennom røret" into "Trekkes Kabelen må gjennom røret", which is
  mechanically correct and not a sentence. There is a box for a verb that is not
  in the task either.
- **Projects are outcomes**, not topics: `outcome::` asks what *done* looks
  like. The dialog that asks says which project it means, because asked out of
  the weekly review it arrives on its own with nothing on screen to say. When
  the page is empty it also shows where the project came from: a project that
  is nothing but a title exists because somebody wrote `[[1/Something]]` in a
  line somewhere, and that line is the only record of what they meant, so the
  lines are shown whole, with the page each came from, and clicking one goes
  there. When there is genuinely nothing to go on it says so rather than
  implying there is. The same applies to the next-action prompt.
- **Contexts** `[[c/phone]]`, and `@@` opens the picker from anywhere. Twice,
  because a single key that does nothing most of the time is a key that
  swallows a keystroke the one time the caret was not where you thought. The
  first `@` arms the same chord indicator `g` and `v` use, so it is visible
  rather than silent, and anything but a second `@` calls it off. On a
  Norwegian or German keyboard `@` is AltGr+2, which arrives as ctrl+alt, and
  that is handled: a shortcut most of Europe cannot press is not a shortcut.

  In the picker you **type the name**: `p` goes to the first context starting
  with p, `p` again cycles to the next one that does, `ph` narrows to phone,
  and Enter switches. A letter that cannot continue the word starts a new one,
  so changing your mind from `w` to `p` works rather than hunting for "wp".
  Every other picker in the app keeps its lettered rows, because the two rules
  cannot share a list: with `computer, errand, phone` the letter c means phone
  to one of them and computer to the other.
- **The context nudge is a toast, not a dialog.** At lunchtime and at the end of
  the day the app wonders whether you have moved, and says so the way a
  colleague would: a line in the corner reading *after work: still @workshop?
  Press @@ to change*, with a button if you would rather click. It never takes
  the keyboard and never covers what you were doing, and ignoring it is a
  complete answer, because it leaves on its own. It used to open the picker
  outright, which is a dialog over your work, on a timer, because the clock
  said five.
- **Age** is tracked from `Added::` and drives "oldest first" everywhere.
- **Morning weeding** surfaces the stalest active projects - hidden under 5
  active projects or 20 open tasks, both modes. `g w` opens it anyway.
- **Weekly review** only becomes due once a week of actual use has passed.
  It lists only the checks that are asking for something; the clear ones are
  counted in one line at the top, because a heading with nothing under it is
  eight screens of congratulation between you and the two that need doing.
- **Stuck projects**: active, with nothing actionable left. The classic trap.
- **Waiting too long**: a `WAIT` older than `CFG.waitFollowUpDays` (14).
- **People to send a check-in to**: somebody outside the space owes you
  something you have never asked about, or asked about more than
  `CFG.waitFollowUpDays` ago. Clicking it opens the sheet for them.
- **Blocked projects**: a project whose `depends_on::` prerequisite is still
  open says so on its own page, and the Timeline hatches a bar that is
  scheduled to run during something it is waiting for.

Two front doors over the same files: **Simple** reads like a to-do app,
**Advanced** like an outliner with journals, `[[links]]`, backlinks and zettel.
The markdown is identical either way.

## Keys

`c` capture · `/` search · `@@` context · `?` all keys · `f t` today · `g n` todos ·
`g x` context · `g a` planned · `g p` people · `g c` chat · `g w` weeding ·
`g r` review · `v b` board · `v c` calendar · `v g` graph ·
`v t` timeline · `v r` report · `f f` focus ·
`ctrl-z` undo a delete · **Copy link** on any task or page ·
`g d` re-surface. In the outline: `Enter` splits the line where the caret is,
`Tab`/`Shift-Tab` indent,
`Ctrl-Enter` cycle state, `[[` a list of pages, `↑`/`↓` between blocks,
`Alt-Shift-↑`/`↓` move the line among its siblings, children and all. In the
grid under a todo or a project: `Esc` walks it with the arrows, `Enter` centres
on a node, and `Enter` on the middle adds a step under it. A long title wraps, so the
arrows walk the lines inside a block first and only leave it from the top or
the bottom line - which is what they do in every other outliner, and what your
hands expect.

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
column to reach the second), and the graph draws the 200 best-connected pages
and says how many it left out - past that it stops being a picture of anything.

Every rationed list ends in the same two buttons: **Show 100 more · 400 below**,
and **Show all 500**. The cap is there because drawing everything was slow, not
because you are not allowed to see it, so wanting the whole list costs one
press rather than five. The second button only appears when it would do
something the first one would not. Tasks, project sections, board columns,
conversations, pages, health findings and the list under the graph all go
through the same code, so it means the same thing wherever you press it.

**The whole-vault questions are asked once per render.** What is open, who is
here, where the conversations are - the sidebar alone used to ask three of them
per item, which cost 146ms a draw on a big vault. Now 6.7ms.

## House style

No em dash appears in anything the app says. These strings land in somebody
else's mail client, where a dash that is not on the keyboard reads as something
a machine wrote - and the whole job of a check-in note is to read as though a
person wrote it. A test asserts the count is zero across the generated subject,
body, headings and buttons, so one cannot creep back in.

## Known limits

- **Block merge matches on text.** Rewording a task on one device while the other
  edits the same page reads as a delete plus an add, so you may see both. Visible
  and fixable, never silent loss.
- **Deleting a single task does not propagate** - only whole-page deletes carry
  tombstones.
- **Spaces are separated, not secured.** Anyone who can open a space's folder or
  file sees all of it. No password, nothing encrypted.
- **The sync server is one shared password, not accounts.** No per-person access,
  no audit beyond the `by::` stamps.
- **A server space re-reads on return, not continuously.** No polling, no push.
- **No phone browser can write into a folder you choose.**
- **The service worker needs a URL**; a downloaded file cannot register one.
- **A document library cannot host the app** - see above.
- **Auto-sync of the courier file is desktop only** (it needs a durable handle).
- **Recurrence is offered, never scheduled.** Nothing appears until you tick the
  current one off and say yes, so a repeat you forget about simply stops.
- **A closed task's bar has no handles.** Its end is the day somebody ticked it
  off, and dragging that would be editing the past. Open bars drag; closed ones
  are a record.
- **Linking two pages in the mindmap is a drag, so it is mouse only.** The
  keyboard walks, centres and adds, but joining two existing pages is a drag;
  the keyboard route is the list under the picture, which also carries
  **Unlink**.
- **A task cannot be dragged onto another dot in the mindmap.** A link is a
  `[[link]]` in a page, and a task is a line inside one, so there is nowhere to
  write it. Moving a task is refiling, which lives in the task itself.
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
  the space, so it says "has this person been around", not "are they online".
- **Undo is this device, this session.** It is a five-minute grace period, not
  history: reload the page and the stack is gone.
- **Chat read state is per device.** A new device shows the whole thread as
  unread; flags, which live in the file, follow you.
- **No live calendar feed**, by choice - see above. Calendar entries are a
  snapshot taken when you press the button; changing the date later does not
  update anything already in your calendar.
- **Notifications arrive on opening the space**, not while it is closed. There is
  no server to push one, and nothing is emailed.
- **An invite cannot carry a folder.** Browsers forbid transferring a directory
  handle, so a folder-backed space needs the folder shared separately and one
  button pressed at the other end.
- **Safari and Firefox are untested by me** (see the table above).
