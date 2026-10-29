# GroupToDo

A shared to-do list built on GTD (Getting Things Done) that keeps everything as plain Markdown files in a folder you already have. **No install, no account, no server.**

**Why it shares easily:** Most task apps keep your tasks on their servers, requiring an account and a paid seat for everyone. GroupToDo has nothing to join: share the folder the way you already share folders (OneDrive, Dropbox, or a network share) and you are done. Remove someone from the folder and they are out. Every file opens in Notepad, so the list outlives the tool.

---

## Quick Start

In Edge or Chrome, double-click `grouptodo.html`. It first asks how you are starting:

* **Somebody invited me** — Your full name, then what you were sent: the shared folder, or an invite or vault file. The folder is opened as it is (none of your starter pages go into it) and the area takes the name stored in the folder, or else the folder's own name. *You are in …* then shows who else is there, the projects and open tasks you now share, and how to hand a task to somebody.
* **I am starting my own** — Your full name, what to call the area, and optionally a folder of your own (skip to keep everything in the browser for now). The name you give is written into the folder, so people you invite later see the same name.

> **Tip:** Click *Set up several areas* on the second path to split your list into separate folders (e.g., Work, Home) before you begin.

### First Steps
* **Onboarding:** **Journal** opens with the cursor in the top input box and a *Getting started* strip that ticks itself off as you add your name, folder, and first task. It then points you to the *Find your way round GroupToDo* tour project. If colleagues already put your name on tasks, those are offered when you arrive.
* **Inviting others:** Go to **Areas menu (top right) → Invite somebody**, or send them `grouptodo.html`, the folder name, and [docs/setup-sheet-group.html](docs/setup-sheet-group.html).
* **Wrong folder or name:** **Areas menu → Folders** renames an area — *just for me*, or *for everyone*, which writes the name into the folder for whoever joins from now on — or changes its folder. Changing from one folder to another asks before copying any pages, and leaves them where they are by default.
* **Solo use across groups:** Using it on your own with several groups around you? See [docs/setup-sheet-personal.html](docs/setup-sheet-personal.html).
* **Migrating from Obsidian or Logseq:** Open `GroupToDo-Importer.html` in Edge or Chrome. It reads your old vault without changing it, asks what your folders/namespaces/tags mean, previews every page before and after, and writes a new GroupToDo folder. (Format details: [docs/vault-format.md](docs/vault-format.md)).

---

## Screens & Views

Every view reads the same Markdown; a change in one is a change everywhere.

| Place | Views | What it answers |
|---|---|---|
| **Journal** | — | What is due or late, the next 7 days, and your journal per area |
| **Next** | List, Board, Calendar | Everything on your plate; board columns per context or tag |
| **Waiting for** | List, Board | What you handed over, grouped by person |
| **Chat** | — | Every conversation thread on a task |
| **Projects** | List, Board, Timeline, Report, Hours | Projects by status, Gantt chart, completed work, and time on site |
| **People / Orgs** | List, Cards, Board | Who is carrying what and where they work; drag onto work or each other |
| **Contexts** | — | Where you are and what you can do there |
| **Pages** | List, Board, Mind map, Graph, Hierarchy | Every page in the areas currently on screen |
| **Horizons / Settings** | — | Purpose down to next actions; checklists you rerun |
| **Weekly review** | Steps, Projects, Actions | The GTD review; projects and next actions dealt with one card at a time |

* **Filtering & Sorting:** On boards, click `✕` on a column header to hide it until you click its pill above the board. In lists, the same chips show/hide contexts, people, or statuses across both views. Use the **Sort** menu to order by urgency (`↑` chip), name, date, age, or length.
* **Export:** **Next**, **Waiting for**, and **Projects** export directly to CSV for Excel.

---

## Core Concepts & Daily Use

### Ownership & Sharing
* **Your day page is yours:** One file per person per day, so nobody types over anybody, though everyone can read it.
* **Single-source delegation:** A task you write is yours. Hand it to someone in the area and it becomes theirs while showing in your *Waiting for*—one task, never two copies. Name someone outside the area and it becomes a plain waiting-for.
* **Catching up:** **Journal** opens with *Since you were last here*; **History** scrolls back day by day.
* **Areas (Work, Home, etc.):** Each area is a separate folder. Tick any combination at the top right to filter the whole app. Drag them in the menu or under **Folders** to reorder columns left-to-right. On **Journal**, each active area gets its own resizable column (drag borders to resize; double-click to even out).
* **Privacy:** Click `⋯` beside a page title → **Make private** to move a page to another folder (the folder is the permission model).

### Capturing & Typing
* **Natural language dates:** The top input box reads *Call Bob fri 2pm*, *Pay rent by 1 nov*, *every monday*, Norwegian days/times, and Taskwarrior syntax (`due:`, `until:`, `hold:`, `remind:`, `pri:`). A toast confirms what it read (click **Keep the words** to undo). Times write as `SCHEDULED:: [[2026-10-23]] 14:00`.
* **Auto-complete:** Names and dates (*tomorrow*, *friday*, *in 3 days*) are picked up as you type; press `Tab` to turn suggestions into links or due dates. Type `@`, `#`, or `[[` to list contexts, projects, and pages.
* **Multi-line editing:** Select multiple lines and press `Tab`/`Shift-Tab` to indent/outdent together, or `Ctrl-Enter` to make them all tasks. Press `@` to give them all one context; lines that already have one are asked about (skip, overwrite, one by one, or clear).
* **Refiling & Undo:** Press `Alt+G` to refile a line to a project, responsibility, or context (like a recurring meeting's agenda). Undo deletes from the toast, or press `Ctrl-Z` (kept for 5 minutes).
* **Demote small projects:** Press `Alt+T` on a line that is only `[[1/Project]]` to turn it into a task. The page remains as a linked plain page, and open project steps hang under the task.

### Navigation & Layout
* **Help where you are:** Press `?` on any screen: *This page* opens at the right with what the page is for, what you can do and what each thing on it is. **Show me** (`s`) puts matching numbers on the screen. The full help has contents, search and a picture of each screen.
* **Side-by-side docking:** Opening a page from a list docks it to the right so you can write while keeping the list visible. **Hold** any link for half a second to open it docked; click `⤢` to make it full screen.
* **Sidebar pins:** Click `⋯` beside a page title to pin pages to the sidebar (saved per device). Drag to reorder, `✕` to unpin.
* **Deep links:** **Copy link** on any task or page gives a URL that opens that exact block.

---

## Features by Workflow

<details>
<summary><b>📅 Scheduling, Repeats, Routines & Reminders</b></summary>

* **Repeats without backlog:** Tasks with `repeat:: weekly` (or *Custom…* like `weekly on mon, thu`, `monthly on the last friday`) are offered only when you tick them off—never scheduled ahead—preventing a backlog of missed chores.
* **Automated routines:** A routine whose `cadence::` is a rule (*every weekday*, *every 2 weeks on fri*, *monthly on the 15th*, *yearly on the first monday of june*) copies its steps onto your day page on the days it falls. Configure start date, step times, and end conditions via `⋯` → *When it comes round* (or in Settings). To run a routine, checklist or project template by hand, type `/run` on the line where its steps should go. Only today is filled, once, so edits apply to future runs and unopened days leave nothing behind. `as needed` stays plain text.
* **On hold & Expiry:** Setting a project's status pill to *On hold…* or adding `hold:: [[date]]` hides a task or project until that date. `hold:: open` (`hold:open` in the top box, or *No date* in the hold dialog) holds it with no date, until you bring it back. `until::` cancels a task once its day passes; birthday tasks disappear once the birthday passes.
* **Chores:** A repeating task shows a bar for how far it has come round since it was last due: 100% is its day, and it turns red a half round late. Urgency counts it in rounds, so a daily chore two days late outranks a monthly one two days late. When you tick a chore off, *Again?* suggests whose turn the next one is (whoever in the area has done it least lately) and hands it over with `assigned::`. To pause chores while you are away, put them under one line or project and hold it (with a date, or `hold:: open`). Once the hold ends, the bars count from that day. **Next → Time → I have 30 min** picks the most urgent sized tasks that fit together, **Contexts** shows how fresh each room is, and **Projects → Report** shows who carried what.
* **Reminders:** Timed tasks trigger a persistent toast 10 minutes before (or via `remind::`). Click the time pill on any line or list row to move the time (`16:45`, `kl 13`, `in 45 minutes`, +10 min, tomorrow, next week) or change its reminder without opening the task panel; 🔔 on the pill means a reminder will go off, 🔕 that it is off. **Journal** counts down to the next timed task and deadline; birthdays show on the calendar.
* **Built-in Timer:** Click `◷` in the sidebar for your default duration (`minutes::` on `pages/8/timer.md`), or press and drag for 1–60 minutes (`max::` raises the cap). Drag up, or Ctrl-drag any way, for an alarm (stays on screen showing time elapsed until clicked); drag left or any other way for a quiet note. The `⋯` beside it lists the settings to pick from: usual length, max, style (bar or dial) and volume. `style:: dial` shows it as a small pie that shrinks instead, the quarters marked, which grows to the sidebar's width above the time while a timer runs (their minutes show while you set it): a click starts the usual length silent, the bell starts it with the alarm and is solid while the alarm is on, and a drag works as on the bar; the wheel down adds.
* **Backdating:** After closing a task or project, the toast offers **Done earlier?** to backdate completion.
</details>

<details>
<summary><b>🤝 Meetings, Email, Chat & External Check-ins</b></summary>

* **Meetings & iCal:** Press `Alt+M` on a line to add attendees, time, and agenda. **📅 Calendars** in Journal imports an iCal link every 30 minutes (requires `serve.py`). Deleted or moved meetings stay that way. A top bar pill shows the current meeting, counts down to the next, and triggers reminders.
* **Calendar export:** **Add to calendar** exports a task as a private `.ics` file or an Outlook/Google link (timed tasks use their dot-duration or default to 1 hour; untimed tasks are all-day).
* **Task threads:** Every task has a conversation thread; **Chat** gathers them all in one view.
* **Email integration:** Paste an email copied from Gmail or Outlook into the top box to create a page under `m/` (Emails) with subject, sender, date, body, a linked *Follow up* task in Journal, and a sender page. Use *Reply*, *Ask for news*, or *Forward* to draft text in your mail app, and *Add their answer* to log replies under today's date. Click *Make tasks instead* in the toast to convert lines directly into tasks.
* **Completion notifications:** When a project finishes, click *Notify* in the toast (or via **Done → History**) to draft an email in your mail app/Teams to everyone in `with::` and the client, listing the outcome and completed steps.
* **Check-ins for outsiders:** **Waiting for → Ask … for an update** generates a self-contained HTML sheet ([mockup](docs/check-in-sheet-mockup.html)) and covering note. Recipients tick off completed items and return a small Markdown file; **Import a reply** closes those tasks in their name.
* **Sending an update:** the same the other way round, for your own tasks somebody is waiting to hear about. Type `/inform` on a line (or **Alt+U**, the line menu, the side panel, or **Send … an update** on a person's or organisation's page). It goes to whoever the line names, else the project's `with::` people or `org::`, else a search over people and organisations that links your pick on the line. Each line gets a status and a comment, sent in the mail or as a read-only HTML sheet. Once sent, each line gets `informed:: Name date`, a *Told Name: …* entry in its chat, and the statuses you changed can go to the tasks. The wording is in **Settings → Inform note**.
* **Stakeholders:** put `stakeholder:: [[p/Kari Nordmann]]` on a responsibility (or press **+ stakeholder** on its page) and Kari hears about every project under it. **Send Kari an update** gives a summary of each: status, next action, what was done since she was last told, and anything late or waiting. Sending records `told::` and a line under *Updates sent* on the responsibility. How often she wants to hear is on her page (`update_every::`, monthly by default), and the weekly review, Waiting for and the nudges say when it is time. Notify on a finished project offers her too.
</details>

<details>
<summary><b>📊 Project Management, Urgency & Weekly Review</b></summary>

* **Timeline & Dependencies:** Gantt bars draw from `SCHEDULED::` and `DEADLINE::`. Drag to reschedule (dragging a project moves all its dated tasks; late projects turn red). Use `depends_on:: [[1/site-survey]]` to mark prerequisites: blocked projects state it, the Timeline draws arrows and hatches overlaps, and moving a project offers to push downstream ones.
* **Taskwarrior Urgency:** **Next** and **Projects** sort by deadline, scheduled day, `priority::`, started state, context, age, and project chain. Hover over the `↑` chip on any row to see the exact score breakdown.
* **Custom task states:** Create a list in Settings with `kind:: states` to define custom stages (e.g., *Ordered (waiting)*, *Awaiting delivery (waiting)*, *Delivered (done)*). Tasks of that type display their custom stage, get their own column in the state menu, and appear in the `/` menu.
* **Burndown:** **Projects → Report** charts open tasks per day over a chosen window alongside a data table.
* **Multi-pass Weekly Review:** Driven by an editable routine (`pages/8/Weekly review.md`). Projects are reviewed in distinct cognitive passes: *status*, *on hold*, *outcome*, and *next action*, followed by *loose actions* (unassigned day-page tasks), then *on hold, no date* and *someday*, where projects are weighed two at a time (cup-style) to rank which to pick up first. Choices are kept in `GTD.md` as `hold_duels::` and `someday_duels::`. **Day pages** displays the last two weeks of journals in full—click lines to promote them to tasks, waiting-fors, or projects, then click *Done with this day* to leave the rest as plain notes.
</details>

<details>
<summary><b>⏱️ Time Tracking, Habits, Costs & Budgets</b></summary>

* **Task clocks:** Click `⏱` under a task to edit time entries: drag on the day timeline, adjust box edges, or type times directly (`+` starts a new stretch where the last ended). Setting a task to *Doing* automatically starts/stops a clock in Logseq `:LOGBOOK:` format (toggleable in **Vault & sync → Time on tasks**).
* **Client billing & splits:** A project's clients come from `org::` links on its page or area (excluding pages marked `role:: supplier`). Multi-client time splits via `client_split:: Alpha 60, Beta 40`, client `share::` properties, or evenly. **Projects → Hours → Clients** breaks down time by day, project, and month.
* **Time on site:** Type `/in` and `/out` on any line to log a `#timelog` visit (who, project, in/out), or check in craftsmen via *Someone on site* in the new-tracker window. Viewed under **Projects → Hours**.
* **Tap-to-count trackers:** Adds a **+1 Coffee** pill in Journal (`tracker-coffee_i:: ☕☕☕`, reading `☕ × 14` past ten). Tap an icon to subtract, or `↺` to reset.
* **Hours, Amounts & Stock sheets:** Log inline on your day page:
  * *Work hours:* `tracker-office_t:: 07:12 - 10:00, 10:30 - 12:30` (includes **Start/Stop** buttons in Journal).
  * *Amounts:* `tracker-food_a:: 129,50 + 45`
  * *Stock:* `tracker-paint_q:: +3` (`-1` out, `=12` counted).
  * **Trackers → Hours / Amounts / Stock** totals the week by day, extra hours, flex against `hours_target::`, and year-by-month summaries (including commute days for tax deductions). Copyable as spreadsheet cells.
* **Prices on tasks:** Write currencies naturally on task lines (`Buy paint EUR 349,95`, `Hire a skip 1200 NOK`, `kr 1 200,-`, `€12`). Highlighted inline and totaled per currency on the project (never converted): completed tasks as **spent**, open as **planned**, cancelled ignored.
</details>

<details>
<summary><b>🤖 AI Planning, Queries, Templates & Tidying</b></summary>

* **Plan with AI:** From a line's menu, selection bar, or email page, GroupToDo builds a prompt (stored in `8/Prompts/GTD project.md`) containing the text, your name, contexts, mentioned people, and candidate existing projects. It copies the prompt and opens your chosen AI (DeepSeek, ChatGPT, Claude, Gemini, Copilot, Le Chat, Perplexity, or local). Paste the reply back: GroupToDo formats links, fixes `TODO [[whole sentence]]` errors, maps contexts, and creates the project and next action.
* **Live queries & Embeds:** Type `/query` to build a live Logseq-style query (`{{query (and [[1/Fix sink]] (task TODO))}}`). Type `/embed` to embed a page, or use *Copy as embed* (`((id))`) for a single line.
* **Templates & Previous values:** Page `key:: value` properties stay in their template's order; click *hide* to fold a property under *hidden values* across all pages using that template. On day pages, trackers and custom properties faintly display what you wrote last time.
* **Deduplication & Look-alikes:**
  * *Look-alike projects & actions:* Duplicate projects (*Nordlys new website* / *New website Nordlys*) and next actions are flagged `⚠ look alike` for one-click merging.
  * *Alias merging:* Giving *John Smith* `aliases:: JS` when a *JS* page already exists prompts to merge them and update all links.
  * *Page tidying:* `⋯` → *Remove duplicate lines* cleans up a page (flagged during Weekly Review). `⋯` → *Copy linked references here* gathers all backlinked lines to the bottom of a page (also offered on project completion). Pages in a namespace (`[[Work/Clients]]`) list sibling pages at the bottom.
* **Microsoft Planner (Experimental):** **Vault & sync → Microsoft Planner** pushes an area's projects to Planner via Power Automate (one card per project in client buckets, next actions as checklist items). See [docs/planner-sync.md](docs/planner-sync.md).
* **Local usage stats:** **Vault & sync → Your use of GroupToDo** logs visits, active minutes, and clicks per screen/view to a private *Usage of GroupToDo* page (never titles or text). Ranks views by weeks used out of the last 13 so you can mark features *Keep*, *Not sure*, or *Could go*.
</details>

---

## Keyboard Shortcuts

| Key | Action |
|---|---|
| `n` | New task |
| `/` | Search |
| `?` | Help |
| `\` | Toggle sidebar |
| `t` | Go to Journal |
| `Alt+←` / `Alt+→` | Navigate back / forward |
| `Ctrl-Z` | Undo |

* **Go to (`g` then letter):** `g n` Next · `g w` Waiting · `g p` Projects · `g c` Chat · `g r` Review
* **Views (`v` then letter):** `v b` Task board · `v c` Calendar · `v p` Project board · `v t` Timeline · `v r` Report · `v g` Mind map · `v m` Graph · `v d` Page board
* **On a line:**
  * `Tab` / `Shift-Tab`: Indent / Outdent
  * `Ctrl-Enter`: Cycle task state
  * `Alt+T`: Toggle task / note · `Alt+1`: Make project · `Alt+M`: Meeting · `Alt+I`: Responsibility
  * `Alt+D`: Due date · `Alt+C`: Context · `Alt+P`: Person · `Alt+O`: Organisation · `Alt+J`: Project · `Alt+R`: Repeat
  * `Alt+G`: Refile · `Alt+S`: Move to another area

---

## Technical Details

### Repository Files

```text
grouptodo.html           The whole app
GroupToDo-Importer.html  Converts an Obsidian or Logseq vault into a new folder
sw.js                    Offline support + Share button (when served from a URL)
manifest.webmanifest     Home-screen install manifest
icon.svg                 App icon
index.html               Redirect so https://host/ works
serve.py                 Optional sync server and calendar fetcher
languages/               Language files; English.md lists every line to translate
docs/                    Setup sheets, mockups, and demo.html (app with sample data)
docs/vault-format.md     File format spec and Obsidian/Logseq conversion guide
docs/planner-sync.md     Sending projects to Microsoft Planner (experimental)
```

### Running It

* **From disk:** Double-click `grouptodo.html`. Desktop Chrome/Edge get the full app including live folder access (no service worker or offline install).
* **From a URL:** Serve via any static host with no build step (`python3 -m http.server 8000`). Adds home-screen install, offline opening, and the mobile Share button.

| Platform / Browser | Live Folder | Vault File Out | Home Screen |
|---|---|---|---|
| **Desktop Chrome / Edge** | **Yes** | Auto-sync | When served |
| **Desktop Firefox** | No | Save / Open | No |
| **Android Chrome / Edge** | No | Share | When served |
| **iOS Safari** | No | Share | When served |

*Check **Vault & sync** (bottom of the sidebar) to see what your current device supports. Safari and Firefox are untested. On iOS, serve from a URL (Safari restricts storage for files opened from the Files app). Do not host the HTML file inside Teams/SharePoint libraries (they sandbox it without storage); instead, click **Sync** in Teams/SharePoint to map the folder to File Explorer and point an area at it.*

### Storage, Sync & `serve.py`

* **Folder structure:** Plain Markdown (`key:: value` properties above a bullet outline). A project's folder defines its status:

```text
journals/<Person Name>/2026-10-05.md   One file per person per day
pages/1/ 2/ 3/ 0/ -/                   Projects: active, someday, waiting, completed, cancelled
pages/_/ g/ a/                         Horizons, goals, responsibilities
pages/8/                               Checklists, routines, templates, custom *.css
pages/c/ p/ o/ z/ m/                   Contexts, people, organisations, notes, pasted emails
```

* **Courier vault file (Mobile/Firefox):** A single `.md` file holding a copy of the whole area for devices that cannot open folders. Keep it *outside* the vault folder. Desktop auto-syncs via *Link vault file*; phones use *Send / Open vault file* (prompts automatically at start/end of day when `work_hours::` is set). Pictures the pages link to travel in it too, base64 below the pages: every one from a phone, the last month's from a computer. A photo from the line toolbar is shrunk to at most 1600 px first.
* **Conflict-free merging:** Pages carry `updated::` timestamps. When both sides change, blocks merge by text. Page deletions travel as tombstones. **Start afresh** wipes only the local browser copy.
* **`serve.py` (Optional live server):** Lets one always-on machine (including Android Termux) serve everyone live without a courier file, and fetches iCal feeds:

```sh
export GTD_PASSWORD="$(head -c 24 /dev/urandom | base64)"
python3 serve.py --vault ~/OneDrive/GroupToDo/Work   # localhost only
tailscale serve --bg 8777                            # HTTPS to your devices
```

Refuses non-localhost connections without a 10+ character password (HTTP Basic; put TLS in front). Without a password, it answers only the app on `localhost` (use `--allow-host <name>` for passwordless tunnels, or `--calendars-only` for iCal fetching alone).

### Privacy & GTD Nudges

* **Zero telemetry:** No external dependencies, CDNs, or analytics. Content Security Policy (CSP) restricts connections strictly to `localhost` (`serve.py`), and calendar fetching only contacts public `https` iCal URLs. All user text is escaped before rendering.
* **Quiet GTD nudges:** Inactive until you have 6+ open tasks, then surfaced during the **Weekly review** (or on row hover in Next/Waiting): missing physical verbs on next actions, missing project outcomes, stuck projects, waits older than 14 days, overdue people check-ins, and blocked projects. Optional 12:00 and 17:00 *"still @context?"* checks can be enabled in **Vault & sync → Context check**.

### Languages & Translations

Switch display languages in **Vault & sync → Language**. Language files live in `pages/8/Languages/` (ignored by search and lists):

```text
language:: Norsk
code:: nb

Today => I dag
Imported {1} file(s). => Importerte {1} fil(er).
Waiting for =>
```

* Download a file from [languages/](languages/) and load it via **Open the file**, or use **Translate it yourself** (in-app editor or **Copy for an AI** / **Paste a translation**).
* Keep `{1}`, `{2}` placeholders intact. Blank lines after `=>` fall back to English. User content is never translated.
* Developers: run `python docs/build-language-catalog.py` after UI string changes to update `grouptodo.html` and `languages/English.md`. Submit new translations to `languages/` via Pull Request.

### Known Limits

* **Text-based merge:** Rewording the same task on two devices simultaneously leaves both versions.
* **Single-task deletion:** Deleting a single task line does not propagate across sync; whole-page deletes do.
* **Folder permissions:** Areas are separated, not encrypted—anyone with folder access can read all files in it.
* **Shared password:** `serve.py` uses a single shared password rather than individual user accounts.
* **Mobile folder access:** Mobile browsers cannot write directly to folders; phones must use the courier vault file or `serve.py`.
* **Pull-only updates:** Updates appear when you open the area; nothing is pushed or emailed.
* **Mouse-only boards:** Dragging cards on boards requires a mouse.
* **Folder invites:** An invite file cannot carry a shared folder; the folder itself must be shared via your cloud/network drive.
* **Device-local state:** Undo history, sidebar pins, and chat read-states are stored per device.

---

## Versions and Tests

The version is shown beside **GroupToDo**, top left; [CHANGELOG.md](CHANGELOG.md) says what each one brought. Include it in bug reports.

The regression battery checks that every screen still draws and that the core logic (Markdown files, dates, repeats, capture, task states, links, mail, invites) still behaves. Run it every week or so, and before every push:

```
node tests/run.mjs          # or double-click tests/run.cmd
node tests/run.mjs parse    # only the tests whose name has "parse" in it
```

It needs Node 22+, Python and Edge or Chrome. It runs on [docs/demo.html](docs/demo.html), whose vault lives in memory, so it never touches your own vault. Tests live in [tests/battery.js](tests/battery.js): every new feature adds one there.

---

## Bugs and Ideas

Report bugs and suggest features at [github.com/kennethaar/GroupTodo/issues](https://github.com/kennethaar/GroupTodo/issues) → **New issue** (search existing issues first and add a 👍 or comment if already raised).

* **Bugs:** Include what you did, what you expected, what happened, your browser/device, whether opened from disk or URL, and a screenshot if possible.
* **Features:** Describe the problem it solves, not just the proposed solution, so it can be weighed against existing tools.

*Note: Issues are public—leave out real task text, names, and file contents.*
