# GroupToDo

A shared to-do list, built on GTD (Getting Things Done), that keeps everything
as plain markdown files in a folder you already have. No install, no account,
no server.

**Why it shares easily.** Most task apps keep your tasks on their servers, so
everybody needs an account and a seat. GroupToDo has nothing to join: share the
folder the way you already share folders (OneDrive, Dropbox, a network share)
and you are done. Remove someone from the folder and they are out. Every file
opens in Notepad, so the list outlives the tool.

---

## Start

In Edge or Chrome, double-click `grouptodo.html`. It asks:

1. **Who** — your full name, shown beside what you add.
2. **Where** — a folder for your files. Skip it to keep everything in the browser for now.
3. **What** — your first task.

The first project, *Find your way round GroupToDo*, is a tour: each step links
to a part of the app. If colleagues already put your name on tasks, you are
offered those when you arrive.

To bring someone in: **areas menu (top right) → Invite somebody**, or send them
`grouptodo.html`, the folder name and [docs/setup-sheet.html](docs/setup-sheet.html).

**Coming from Obsidian or Logseq?** Give [docs/vault-format.md](docs/vault-format.md)
to an AI assistant along with a few sample notes, and ask it to write a converter.

---

## Using it

- **Your day page is yours.** One per person, so nobody types over anybody, but everyone can read it.
- **A task you write is yours.** Hand it to someone in the area and it becomes theirs and shows in your *Waiting for* — one task, never two copies. Name someone outside the area and it becomes a plain waiting-for.
- **You are told what you missed.** Today opens with *Since you were last here*; **History** scrolls back day by day.
- **Areas** (Work, Home, …) are separate folders. Tick any combination at the top right and every screen shows those.
- **Meetings** are lines: **Alt+M** adds attendees, time and agenda. **📅 Calendars** on Today imports an iCal link into a day page every 30 minutes (needs `serve.py`, see below).
- **Names and dates are picked up as you type** — *tomorrow*, *friday*, *in 3 days*; `Tab` turns a suggestion into a link or due date. `@`, `#` and `[[` list people, projects and pages.
- **Threads on tasks.** Every task has a conversation; **Chat** gathers them all.
- **Repeats** (`repeat:: weekly`) are offered when you tick one off, never scheduled ahead, so there is no backlog of missed chores.
- **Undo** a delete from the toast, or `Ctrl-Z` for five minutes.
- **Make private** (⋯ beside a page title) moves a page to another folder — the folder is the permission model.

### Screens

| Place | Views | What it answers |
|---|---|---|
| **Today** | | what is due or late, the next seven days, your journal per area |
| **Next** | List, Board, Calendar | everything on your plate; board columns per context or tag |
| **Waiting for** | List, Board | what you handed over, by person |
| **Chat** | | every conversation on a task |
| **Projects** | List, Board, Timeline, Report | by status, as a Gantt, and what got done |
| **People**, **Organisations** | List, Cards, Board | who is carrying what; drag them onto work |
| **Contexts** | | where you are and what you can do there |
| **Pages** | List, Board, Mind map, Graph, Hierarchy | every page in the areas on screen |
| **Horizons**, **Routines & lists** | | purpose down to next actions; checklists you rerun |
| **Weekly review** | Steps, Projects | the GTD review, projects dealt one card at a time |

Every view reads the same markdown; a change in one is a change everywhere.
Next, Waiting for and Projects export to CSV for Excel.

### Highlights

- **Timeline.** Bars come from `SCHEDULED::` and `DEADLINE::`. Drag to reschedule; dragging a project moves all its dated tasks. Late projects turn red.
- **Project order.** `depends_on:: [[1/site-survey]]` marks what must finish first. Blocked projects say so, the Timeline draws arrows and hatches overlaps, and downstream projects are offered a push when you move one.
- **Check-ins for outsiders.** **Waiting for → Ask … for an update** makes a self-contained HTML sheet plus a covering note. They tick what is done, send back a small markdown file, and **Import a reply** closes those tasks in their name. The sheet carries only the lines you chose. See the [mockup](docs/check-in-sheet-mockup.html).
- **Weekly review.** The steps are an editable routine (`pages/8/Weekly review.md`). Projects are reviewed in three passes — status, outcome, next action — because each needs a different kind of thinking.
- **Copy link** on any task or page gives a URL that opens exactly that block.
- **Add to calendar** as an `.ics` file (private, offline) or an Outlook/Google link. Nothing is ever subscribed.

---

## Bugs and ideas

Report bugs and suggest features at
[github.com/kennethaar/GroupTodo/issues](https://github.com/kennethaar/GroupTodo/issues)
→ **New issue**. You need a free GitHub account. Search first; if someone already
raised it, add a 👍 or a comment instead.

- **A bug:** what you did, what you expected and what happened. Add the browser
  (Edge, Chrome, …), the device, and whether you opened the file from disk or a
  URL. A screenshot helps.
- **A feature:** the problem it would solve, not only the solution, so it can be
  weighed against what is already there.

Leave out real task text, names and file contents. Issues are public.

---

# Technical details

## Files

```
grouptodo.html         the whole app
sw.js                  offline + Share button, when served from a URL
manifest.webmanifest   home-screen install
icon.svg               icon
index.html             redirect, so https://host/ works
serve.py               optional sync server and calendar fetcher
docs/vault-format.md   the file format, and converting from Obsidian or Logseq
docs/                  setup sheet and mockups
```

## Running it

- **From disk:** double-click `grouptodo.html`. Desktop Chrome/Edge get the full app including a live folder. No service worker, so no offline install.
- **From a URL:** any static host, no build — `python3 -m http.server 8000`. Adds home-screen install, offline open and the Share button.

| | Live folder | Vault file out | Home screen |
|---|---|---|---|
| Desktop Chrome / Edge | **yes** | auto-sync | served |
| Desktop Firefox | no | Save / Open | no |
| Android Chrome / Edge | no | Share | served |
| iOS Safari | no | Share | served |

**Vault & sync** (bottom of the sidebar) shows what the current device allows.
Safari and Firefox are untested. On iOS, serve from a URL; Safari restricts
storage for files opened from the Files app.

**Teams / SharePoint libraries cannot host the app** — they sandbox it with no
storage. Instead, **Sync** the channel's Files folder to File Explorer and point
an area at it.

## Storage and sync

- **Storage** is a folder of markdown: `journals/<person>/<date>.md` and `pages/`. Desktop Chrome/Edge write it as you type.
- **The vault file** is a courier: one `.md` holding a copy of the whole area, for devices that cannot open folders (all phones). Keep it *outside* the vault folder. On desktop, *Link vault file* syncs it automatically; on phones, *Send / Open vault file*.
- **It merges, never overwrites.** Pages carry `updated::`; when both sides changed, blocks are merged by text. Page deletes travel as tombstones. Re-syncing is always safe.
- **Start afresh** (Vault & sync) wipes this browser's copy only; files on disk and the server are untouched.

## serve.py

One always-on machine serves everybody, live, with no courier file:

```sh
export GTD_PASSWORD="$(head -c 24 /dev/urandom | base64)"
python3 serve.py --vault ~/OneDrive/GroupToDo/Work   # localhost only
tailscale serve --bg 8777                            # HTTPS to your devices
```

It refuses to listen beyond localhost without a password of 10+ characters
(HTTP Basic — put TLS in front). Works in Termux on Android too. For calendar
import alone, run `python serve.py --calendars-only`.

## Privacy and corporate use

No dependencies, CDN or telemetry. The CSP allows connections only to
localhost, so the app cannot send data anywhere but your own `serve.py`. Its
calendar fetch only reaches public https iCal links. A static host sees ordinary
web-server logs, never tasks. Every piece of user text is escaped before it
reaches the page.

## The vault

```
journals/<Person Name>/2026-10-05.md   one file per person per day
pages/1/ 2/ 3/ 0/ -/   projects: active, someday, waiting, completed, cancelled
pages/_/ g/ a/         horizons, goals, responsibilities
pages/8/               checklists, routines, templates
pages/c/ p/ o/ z/      contexts, people, organisations, notes
```

Plain markdown: `key:: value` properties, then a bullet outline. A project's
status is its folder. The full format, and how to convert an **Obsidian or
Logseq** vault (written so you can hand it to an AI), is in
[docs/vault-format.md](docs/vault-format.md). Existing `.org` vaults are
converted on request.

## GTD nudges

Quiet until there are six open tasks, and listed on **Weekly review**: next
actions start with a physical verb, projects state an outcome, stuck projects
(nothing actionable), waits older than 14 days, people due a check-in, and
blocked projects.

## Keys

`n` new task · `/` search · `?` help · `\` sidebar · `t` today ·
`g n` `g w` `g p` `g c` `g r` next, waiting, projects, chat, review ·
`v b` `v c` `v p` `v t` `v r` `v g` `v m` `v d` boards, calendar, timeline, report, mind map, graph ·
`Alt+←/→` back/forward · `Ctrl-Z` undo.

On a line: `Tab`/`Shift-Tab` indent, `Ctrl-Enter` cycle state, `Alt+T` task or
note, `Alt+1` project, `Alt+D` `Alt+C` `Alt+P` `Alt+O` `Alt+J` `Alt+R` due,
context, person, organisation, project, repeat, `Alt+M` meeting, `Alt+I`
responsibility, `Alt+S` move to another area.

## Known limits

- Merge matches on text: rewording a task on two devices at once can leave both versions.
- Deleting a single task does not propagate; whole-page deletes do.
- Areas are separated, not secured — anyone with the folder sees all of it.
- `serve.py` is one shared password, not accounts.
- No phone browser can write to a folder; phones use the vault file or `serve.py`.
- News arrives when you open the area; nothing is pushed or emailed.
- Board drag is mouse only.
- An invite cannot carry a folder; it must be shared separately.
- Undo and chat read state are per device.
