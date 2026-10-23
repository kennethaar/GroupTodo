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
`grouptodo.html`, the folder name and [docs/setup-sheet-group.html](docs/setup-sheet-group.html).
Using it on your own, with several groups around you? [docs/setup-sheet-personal.html](docs/setup-sheet-personal.html) is the same app from that side.

**Coming from Obsidian or Logseq?** Open `GroupToDo-Importer.html` in Edge or Chrome. It reads your
old vault (never changing it), asks what your folders, namespaces and tags mean, shows a test run
with every page before and after, and writes a GroupToDo folder into a new, empty folder. The
format it writes is described in [docs/vault-format.md](docs/vault-format.md).

---

## Using it

- **Your day page is yours.** One per person, so nobody types over anybody, but everyone can read it.
- **A task you write is yours.** Hand it to someone in the area and it becomes theirs and shows in your *Waiting for* — one task, never two copies. Name someone outside the area and it becomes a plain waiting-for.
- **You are told what you missed.** Today opens with *Since you were last here*; **History** scrolls back day by day.
- **Areas** (Work, Home, …) are separate folders. Tick any combination at the top right and every screen shows those.
- **Meetings** are lines: **Alt+M** adds attendees, time and agenda. **📅 Calendars** on Today imports an iCal link into a day page every 30 minutes (needs `serve.py`, see below). The next meeting today is shown at the top, counting down, with a reminder a few minutes before (set in Calendars).
- **Names and dates are picked up as you type** — *tomorrow*, *friday*, *in 3 days*; `Tab` turns a suggestion into a link or due date. `@`, `#` and `[[` list people, projects and pages.
- **Threads on tasks.** Every task has a conversation; **Chat** gathers them all.
- **Repeats** (`repeat:: weekly`) are offered when you tick one off, never scheduled ahead, so there is no backlog of missed chores.
- **Undo** a delete from the toast, or `Ctrl-Z` for five minutes.
- **Make private** (⋯ beside a page title) moves a page to another folder — the folder is the permission model.
- **Live lists and embeds.** `/query` on a line builds a Logseq-style query (`{{query (and [[1/Fix sink]] (task TODO))}}`) that lists matching lines, kept up to date; `/embed` shows another page in the line, and a line's menu has *Copy as embed* for one line. `((id))` reads as the line it points at.
- **Last time.** On a day page, a tracker or a `key:: value` of your own shows faintly what you wrote the previous time.
- **Tidy.** ⋯ beside a page title → *Remove duplicate lines*; the weekly review says when pages have some. A page in a namespace (`[[Work/Clients]]`, *Work - Clients*) lists the rest of its family at the bottom.

### Screens

| Place | Views | What it answers |
|---|---|---|
| **Today** | | what is due or late, the next seven days, your journal per area |
| **Next** | List, Board, Calendar | everything on your plate; board columns per context or tag |
| **Waiting for** | List, Board | what you handed over, by person |
| **Chat** | | every conversation on a task |
| **Projects** | List, Board, Timeline, Report, Hours | by status, as a Gantt, what got done, and time on site |
| **People**, **Organisations** | List, Cards, Board | who is carrying what and where they work; drag them onto work and onto each other |
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
- **Weekly review.** The steps are an editable routine (`pages/8/Weekly review.md`). Projects are reviewed in passes — status, on hold, outcome, next action — because each needs a different kind of thinking. The on hold pass asks of each project on hold whether it still is, or can be done now. After the next actions, the loose actions pass takes each action on your day pages that no project or responsibility holds, and asks which one it belongs to.
- **Copy link** on any task or page gives a URL that opens exactly that block.
- **Add to calendar** as an `.ics` file (private, offline) or an Outlook/Google link. Nothing is ever subscribed.
- **Dates in the words.** The box at the top reads *Call Bob fri 2pm*, *Pay rent by 1 nov*, *every monday*, Norwegian days and times, and Taskwarrior's `due:`, `until:`, `hold:`, `remind:` and `pri:`. A toast says what it read, with **Keep the words** to undo. A time is written after the day: `SCHEDULED:: [[2026-10-23]] 14:00`.
- **Reminders.** A task with a time gets a toast 10 minutes before (or `remind::`), which stays until answered. Today counts down to the next timed task and the next deadline; birthdays are on the calendar.
- **Urgency.** Next and the project list are ordered by Taskwarrior's urgency: deadline, scheduled day, `priority::`, started, context, age, project chain. The ↑ chip on a row says why.
- **On hold.** `hold:: [[date]]` on a task or a whole project hides it until that day. `until::` cancels a task once its day has passed; birthday tasks go once the birthday has.
- **Burndown.** The Report shows open tasks per day over its window, with the numbers as a table.
- **Phone and PC.** On a phone, **Send** sits in the top bar with a dot while changes are unsent; with `work_hours::` the PC and the phone ask for each other's file at the start and end of the day.
- **Time on site.** `/in` and `/out` on any line write a `#timelog` visit: who, which project, in and out. **Projects → Hours** shows each week by day, and a project's page its hours per week.
- **Sheets: hours, amounts, stock.** Three more tracker kinds take the line as you say it: `tracker-office_t:: 07:12 - 10:00, 10:30 - 12:30` (start and end, one tracker per place you work, with **Start**/**Stop** on today's page), `tracker-food_a:: 129,50 + 45` and `tracker-paint_q:: +3` (`-1` out, `=12` counted). **Trackers → Hours / Amounts / Stock** adds them up: the previous week by day with a column per tracker, the total, extra hours per day worked and flex against a normal day per weekday, then the year by month (days at each place, so the days driven in for a travel deduction). Decimal hours with a comma if you like, and both copy as cells for a spreadsheet. Settings are on your own page as `hours_target::`, `hours_extra::` and so on.
- **Time per client.** Setting a todo to Doing starts a clock and leaving Doing stops it, in Logseq's `:LOGBOOK:` lines. A project's client is the organisation its page or area names (`org::`). **Projects → Hours → Clients** is the week by day per client, the projects the time went to and the year by month; a project's page shows the time on its todos.
- **Languages.** The app ships in English; **Vault & sync → Language** switches what this device shows. Each language is a file in `pages/8/Languages/`, one line per piece of text: `Today => I dag`. Get one from the [languages folder](languages/) here on GitHub (download it, then **Open the file**), or **Translate it yourself**: fill in the lines in the app, or **Copy for an AI** and **Paste a translation** back. What people write is never translated. To share a translation, add the file to `languages/` in a pull request.

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
languages/             language files; English.md lists every line to translate
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

## Languages

Each area has `pages/8/Languages/`, one file per language. The app writes
`English.md` there itself and adds lines when a newer version has more text;
the others are yours. They are not pages: search, links and lists never see them.

```
language:: Norsk
code:: nb

Today => I dag
Imported {1} file(s). => Importerte {1} fil(er).
Waiting for =>
```

- One line per piece of text on screen, the English before `=>`, the translation after.
- `{1}`, `{2}` are a number or name the app fills in; keep them, in any order.
- A line with nothing after `=>` stays in English, so a half-done file is usable.
- Text is translated as it appears on screen, exact lines only. Editable text,
  page and task titles are never touched.
- The app does not fetch from GitHub; the page's security policy allows no host
  but your own sync server. Download a file from [languages/](languages/) and
  open it in **Vault & sync → Language → Get one from GitHub**, or put it in the folder.

**Sharing a translation:** start it with **Translate it yourself**, then add the
file from `pages/8/Languages/` to `languages/` here in a pull request.

**After changing words in the app:** `python docs/build-language-catalog.py`
rebuilds the list in `grouptodo.html` and `languages/English.md`. A line it
misses can still be added to a language file by hand.

## Keys

| Key | Does |
|---|---|
| `n` | new task |
| `/` | search |
| `?` | help |
| `\` | sidebar |
| `t` | today |
| `Alt+←` / `Alt+→` | back / forward |
| `Ctrl-Z` | undo |

**Go to** (press `g`, then a letter): `g n` next · `g w` waiting · `g p` projects · `g c` chat · `g r` review

**Views** (press `v`, then a letter): `v b` task board · `v c` calendar · `v p` project board · `v t` timeline · `v r` report · `v g` mind map · `v m` graph · `v d` page board

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
