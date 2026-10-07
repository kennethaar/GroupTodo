# GroupTodo

A shared to-do list that keeps everything as ordinary text files in a folder you
already have. Nothing to install, no account, no password, and no server.

**Why this one can actually be shared.** Most task apps keep your tasks on their
servers, which is why sharing one is such a nuisance: everybody needs an account
on the same thing, somebody pays for the seats, and adding a colleague means
asking whoever administers it. GroupTodo has nothing to be a member of. Your
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
because nobody here could tick it off. When you give your name, GroupTodo offers
you that pile — take them on and they become your tasks, while staying in your
colleagues' *Waiting for*, because they wrote them.

**Your first project is the tour.** The first space starts with one project,
*Find your way round GroupTodo*, and every step in it is a door: an ordinary
task whose text links straight to the part of the app it is about — Todos,
Planned, Contexts, People, Routines & lists, the weekly review, Search, and the
folder your files live in. Press the link and you are there. Come back and
GroupTodo offers to tick off the steps whose destination you have now seen — it
asks, because only you know whether looking was enough, and it never ticks one
for you. They are tasks like any others, so reword them, reorder them or delete
the lot; when the last one closes, the project files itself away like any other.

To bring somebody in, use **Spaces → Invite somebody** (below). Failing that:
send them `grouptodo.html`, the name of the shared folder, and
`docs/setup-sheet.html` — the same three steps, written for somebody who does not
want to know how any of it works.

---

## How it works day to day

Nothing is hidden, but nothing appears before it is about something. The app
teaches itself as you use it.

**Your day page is yours.** Each person gets their own, so nobody types over
anybody. What you put on it is still visible to everyone.

**A task you write is yours.** No assigning, no ceremony. That is the common
case, so it costs nothing.

**Hand one over and it tracks itself.** Give a task to somebody in the space and
it becomes theirs — and appears in your *Waiting for*. One task, two points of
view, never two copies, so ticking it off once is enough for both of you.

**Name somebody outside the space** and it becomes a plain waiting-for instead,
because they cannot see it and cannot tick it off. Calling that a task would be
a lie.

**People** appears once there is more than you. *Waiting for* only tells you what
you handed over; this tells you what everyone is carrying. Click a name to see
their projects and open work.

**States are checkboxes.** To do, Doing and Waiting for tick on and off
independently, so you can read them together or one at a time. A state nothing
is in is never mentioned.

**You are told what you missed.** There is no server to push a notification, so
the app looks for itself: open a space and it tells you what happened since you
last did — work somebody handed you, and work you handed over that is now
finished. Click one to go straight to it. "Last seen" is per device and never
written to the shared files, so marking your own news read does not mark it read
for everybody.

### Linking to a task from anywhere else

"Did you correct the colours on the rollup?" is a sentence somebody types in
Teams, in an email, in a text. **Copy link** — on a task, or on any page — gives
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

### Faces, and who has been here

**One name and one photo per space.** Both belong to that space alone: the name
is kept on this device, the photo in your own page inside that vault, so Work and
Private can show different ones and neither follows you between them.

**Add a photo of yourself** in **Vault & sync**, beside your name — or click
your own face in People. It opens the ordinary file picker, which on a phone
offers the camera or your photo library.

The picture lives in your own person page as a `data:` URI, so it travels in the
vault like everything else: no upload, no server, nowhere else for it to go
missing. It is redrawn at 96px and the quality stepped down until it fits a hard
24KB ceiling — a 470KB, 1200×900 photo comes out at about 2KB of text. No
picture means initials in a colour derived from your name, stable everywhere.

**`last_seen::`** on the same page answers "has anybody even opened this
lately". It is written at most once an hour, so it does not churn the file, and
shows up in People (*last seen 3 hours ago*, *here now*) and beside a name in
chat. A space with `no_attribution:: true` records this too — same promise.

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

**Chat** gathers every thread you have — across every space you are showing,
every project and every day page — newest first, with the task it belongs to,
who spoke last and what they said. Filter it by *All*, *Unread* or *Flagged*;
click a row and you land on the task itself, switching space if it lives in
another one. The nav entry appears once there is a conversation to find.

New messages on tasks you are part of also turn up in the arrival notice.

### Dates in your calendar

Anything with a date gets **Add to calendar**, and **Planned** sends the whole
window at once. Two routes, deliberately different:

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

If something should not be seen, open the page and use **make private**. It asks
which other folder to move it to, because moving it is the only thing that
actually makes it private. A checkbox would be a lie.

### Inviting somebody

**Spaces → Invite somebody.** Two shapes:

- **Invite file** (`join-work.md`) — the space already set up, its name and
  colour and server address, plus everything in it. They open it with *Open one
  I was sent* and they are in. Needs `grouptodo.html` at their end.
- **One file: app + space** — when you opened GroupTodo from a web address it
  can bake itself and the space into a single `.html`. They open that one file
  and nothing else, and it offers to put them straight in.

The one thing an invite cannot carry is the folder: a browser will not let a
directory handle be serialised or transferred, by design. So for a folder-backed
space the invite *names* the folder and leaves them one button to press — and
they do need the folder shared with them separately. A server-backed space needs
nothing at all, because the address travels in the file.

Separate parts of life get separate folders, called **spaces** — Work, Home,
Volunteering. Two spaces can never share a folder and one can never sit inside
another, so the folder you share is exactly what you meant to share. Colleagues
who get Work cannot see Home because it is not in there.

### Phones

A phone can run GroupTodo, but not from a file: phones give a page opened as a
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
manifest.webmanifest   home-screen icon, own window, "open .md with GroupTodo"
icon.svg               that icon
index.html             two lines, so a hosted copy answers at https://host/
serve.py               optional sync server (a laptop, a Pi, a NAS, Termux)
docs/setup-sheet.html  the two-minute sheet to hand to colleagues
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
cd GroupTodo && python3 -m http.server 8000     # then http://127.0.0.1:8000/
```

That buys *Add to Home Screen*, opening with no network at all after the first
visit, the system Share button for moving the vault file, and durable storage.
`https://host/` and `https://host/grouptodo.html` both work. Updating is a
refresh.

### What each platform can do

Capabilities are probed at runtime — **Vault & sync** tells you what this device
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
and it becomes a real folder in File Explorer — point a space at that.

### What a host can see

Hosting does not put your tasks anywhere. The link serves the empty app. The
whole codebase makes six network calls, all to `./api/*` on the optional sync
server, and the CSP — `connect-src 'self' http://127.0.0.1:* http://localhost:*`
— blocks every other destination, including a server address typed by hand
unless it is localhost. No analytics, no error reporting, no remote font or
script.

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
the whole space, used only to reach a device that cannot open a folder — which
means every phone. Linking one does not change where your files live, and a page
the phone sends back lands as its own `.md` file in the folder.

Keep the courier **outside** the vault folder. If one ends up inside, GroupTodo
recognises it, refuses to read it as a page, and says so.

### The courier in practice

- **Desktop Chrome / Edge**: *Link vault file* once and the clicking is over. It
  merges when the space opens, merges again when you come back to the tab, and
  writes back about a minute after you stop typing — never mid-edit, and quietly
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
cannot — no Android browser can.

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
Harmless — merging is by content, not filename — but tidy up occasionally.

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
everything — the page, `sw.js`, the manifest and the API alike. Basic encodes
rather than encrypts, so terminate TLS in front and leave the server on
localhost.

Tailscale Funnel routes by TLS server name *without* terminating, so it moves
bytes it cannot read — a different trust position from a CDN that decrypts your
traffic in order to serve it.

A server space **re-reads when you come back to the app**: it sends yours up
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

Each space is a vault with this shape, in its own folder:

```
journals/kenneth/2026-10-05.md   one file per person per day
pages/
  _/                        cancelled projects, and the horizon pages:
                              _/Purpose.md  (H5)   _/Vision.md  (H4)
  0/  1/  2/  3/            project status: completed, active, someday, waiting
  8/                        routines, lists  -> [[8/Onboard new customer]]
  a/                        areas of focus   -> [[a/Health]]       (H2)
  g/                        goals            -> [[g/Debt cleared]] (H3)
  c/                        contexts         -> [[c/phone]]
  p/  o/                    people, organisations
  z/                        zettel notes
  templates/  verbs/        templates, Phys-Viz verb lexicon
  GTD.md                    per-vault settings
```

Listed in the vault's own order: `_`, `0`, `1`, `2`, `3`, then `8`.

Naming yourself creates `pages/p/<Your Name>.md` with `member:: true`, which is
what tells everybody else in the space that you exist. Changing your name later
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
updated:: 2026-10-05T09:12:00Z

- TODO Call the plumber about the leak [[c/phone]]
  Added:: [[2026-10-01]]
  SCHEDULED:: [[2026-10-08]]
- TODO Chase the quote [[c/phone]]
  assigned:: Alice
- DONE Buy pipe tape [[c/errand]]
  Added:: [[2026-09-10]] - [[2026-09-12]] = 2 days
```

`assigned::` is who is doing it; absent means you. Somebody in the space keeps it
a live task in their name and puts it in your *Waiting for*; anybody else makes
it a `WAIT`.

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
tasks, simple mode shows no hygiene nudges at all.

- **Next actions must start with a filmable verb.** "Call", "draft", "buy" — not
  "think about". The lexicon is markdown in `pages/verbs/`, with synonyms.
- **Projects are outcomes**, not topics: `outcome::` asks what *done* looks like.
- **Contexts** `[[c/phone]]`, picked with a letter key.
- **Age** is tracked from `Added::` and drives "oldest first" everywhere.
- **Morning weeding** surfaces the stalest active projects — hidden under 5
  active projects or 20 open tasks, both modes. `g w` opens it anyway.
- **Weekly review** only becomes due once a week of actual use has passed.
- **Stuck projects**: active, with nothing actionable left. The classic trap.
- **Waiting too long**: a `WAIT` older than `CFG.waitFollowUpDays` (14).

Two front doors over the same files: **Simple** reads like a to-do app,
**Advanced** like an outliner with journals, `[[links]]`, backlinks and zettel.
The markdown is identical either way.

## Keys

`c` capture · `/` search · `?` all keys · `f t` today · `g n` todos ·
`g x` context · `g a` planned · `g p` people · `g c` chat · `g w` weeding ·
`g r` review · `ctrl-z` undo a delete · **Copy link** on any task or page ·
`g d` re-surface. In the outline: `Enter` new block, `Tab`/`Shift-Tab` indent,
`Ctrl-Enter` cycle state.

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
quarter of a million DOM nodes. Rows are drawn 60 at a time and project
sections 25 at a time, with the rest one click away and the headings still
showing true totals: 120ms and 3,400 nodes at the same twenty thousand.

**The whole-vault questions are asked once per render.** What is open, who is
here, where the conversations are — the sidebar alone used to ask three of them
per item, which cost 146ms a draw on a big vault. Now 6.7ms.

## Known limits

- **Block merge matches on text.** Rewording a task on one device while the other
  edits the same page reads as a delete plus an add, so you may see both. Visible
  and fixable, never silent loss.
- **Deleting a single task does not propagate** — only whole-page deletes carry
  tombstones.
- **Spaces are separated, not secured.** Anyone who can open a space's folder or
  file sees all of it. No password, nothing encrypted.
- **The sync server is one shared password, not accounts.** No per-person access,
  no audit beyond the `by::` stamps.
- **A server space re-reads on return, not continuously.** No polling, no push.
- **No phone browser can write into a folder you choose.**
- **The service worker needs a URL**; a downloaded file cannot register one.
- **A document library cannot host the app** — see above.
- **Auto-sync of the courier file is desktop only** (it needs a durable handle).
- **Recurrence is offered, never scheduled.** Nothing appears until you tick the
  current one off and say yes, so a repeat you forget about simply stops.
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
- **No live calendar feed**, by choice — see above. Calendar entries are a
  snapshot taken when you press the button; changing the date later does not
  update anything already in your calendar.
- **Notifications arrive on opening the space**, not while it is closed. There is
  no server to push one, and nothing is emailed.
- **An invite cannot carry a folder.** Browsers forbid transferring a directory
  handle, so a folder-backed space needs the folder shared separately and one
  button pressed at the other end.
- **Safari and Firefox are untested by me** (see the table above).
