# GroupTodo

A GTD system that is **one HTML file** and **plain markdown**. No build, no
install, no account, no server, no network access of any kind.

**Spaces** keep the parts of your life apart: Work, Private, Volunteer. Each is a
complete separate vault, so colleagues who get Work never see Private.

Two front doors over the same files:

- **Simple** — horizons of focus, projects, todos, contexts, checklists. Reads
  like Microsoft To Do.
- **Advanced** — daily journals, outliner, `[[links]]`, backlinks, zettel. Reads
  like Logseq.

Switch any time from the sidebar. The markdown on disk is identical either way.

It began as a Neovim + org-mode + org-roam config; the status directories, the
Phys-Viz verb rule, the context links, the age tracking and the morning/weekly
rituals all survive the move.

```
index.html   the entire app
serve.py     optional always-on sync server (Termux, Pi, NAS)
```

---

## Running it

Open `index.html`. That is the whole install. It works from a file on disk, a
USB stick, a network share, or any static web host.

Serving it (`python3 -m http.server`, an intranet path, GitHub Pages) adds two
things: the browser will offer to **install it as an app**, and storage is more
reliably durable. Everything else is identical.

### What each platform can do

Capabilities are **probed at runtime**, not assumed — open **Vault & sync** and
the top panel tells you exactly what this device allows. The short version:

| | Runs standalone | Stores locally | Live folder of `.md` | Serverless sync |
|---|---|---|---|---|
| Windows / macOS / Linux, Chrome or Edge | yes | yes | yes | one-click |
| Windows / macOS / Linux, Firefox | yes | yes | no | Save / Open |
| Android, Chrome | yes | yes | no | Save / Open |
| iOS / iPadOS, Safari | yes | see note | no | Save / Open |

**iOS note.** Safari restricts storage for pages opened directly from the Files
app. If it does, GroupTodo says so in plain words at startup and in Vault &
sync, and keeps working in memory for the session — you just need to save the
vault file before closing the tab. Serving the file from any URL removes the
restriction entirely, so on iPhone and iPad **serving it is the better path**.

I verified the Chromium behaviours on this list directly. **Safari and Firefox I
could not test** — no engine available in my environment — so those rows come
from documented behaviour, and the app's own runtime probe is the authority on
your actual device.

---

## Spaces — keeping work, private and volunteer apart

A space is a **complete, self-contained vault**: its own journals, projects,
contexts, checklists and its own horizons, right up to its own purpose and
vision. Your Work space has Work's areas of focus; your Private space has its
own.

That matters for sharing. **The unit you hand over is a whole space** — a folder
you share in OneDrive or Dropbox, or one exported markdown file. Nothing from any
other space is inside it:

- Each space stores its files in its own place, chosen separately. Work can live
  in the company OneDrive while Private lives in iCloud and never touches it.
- Each space exports to its own file: `grouptodo-work.md`, `grouptodo-private.md`.
- Browser storage is namespaced per space.

The separation is a folder and file boundary, not a filter in the UI that someone
could switch off. Verified by test: an export of Work contains no Private content
and vice versa.

Set them up in the wizard on first run, or add one any time from the space
switcher at the top of the sidebar. Give each space its own folder in
**Vault & sync**; until you do, it lives in browser storage.

### What GroupTodo does not do

It has **no accounts and no permissions of its own**. Whoever can open the folder
or the file can read and change everything in that space. The sharing controls
are your cloud drive's — share the Work folder with colleagues, and do not share
the Private one. Revoking means unsharing the folder.

### Showing one space, or several

By default you see one space at a time. In the space switcher, tick exactly the
spaces you want on screen — **any combination, including hiding the one you are
in**. Untick Work and it is gone from every list until you tick it back; the
choice is remembered across restarts.

If you hide the space you were capturing into, that role moves to a space that is
still shown. At least one space is always visible. Tapping a name makes it the
capture target: in single-space mode switching replaces what you were looking at,
in multi-space mode it joins the set.

When several are shown, every row carries a coloured badge saying which space it
came from, and an edit is written back to **that** space's own files — ticking off
a Work task while Private is active updates Work, never Private. Opening a page
switches to its space, so the outliner and backlinks work where the page lives.
"Show only <space>" puts the wall straight back up.

Actions, projects and search merge across the ticked spaces. Horizons, the weekly
review and the health check stay scoped to the active space, because those
describe one life each — merging someone's work purpose with their family purpose
would be nonsense.

The toggle is stored per device, never inside a space, so it does not travel in a
shared folder.

---

## Serverless sync

No server, no account, no third party. Your whole vault travels as **one
markdown file** that you keep in a folder your devices already sync — iCloud
Drive, OneDrive, Dropbox, Google Drive, Syncthing, a network share.

- **Desktop Chrome / Edge**: *Link vault file* once, then *Sync now* reads,
  merges and writes back in a single click.
- **Everywhere else, iOS included**: *Save vault file* and *Open vault file* use
  the ordinary browser Save and Open dialogs, which reach iCloud Drive and the
  Files app like any other document.

**It merges rather than overwrites.** Every page carries an `updated::` stamp.
When a page changed on only one device, the newer side wins. When it changed on
**both** — two phones appending to the same day — the blocks are merged, matched
on their text, so every addition from both sides survives and a task you
checked off propagates instead of duplicating. Deletes travel as tombstones so a
deleted page does not come back on the next sync. Re-syncing the same file
changes nothing.

Tested: concurrent appends on two devices, check-off propagation, repeated
syncs, and deletions. All verified in headless Chromium.

### Alternative: a live folder

Desktop Chrome/Edge can open a real folder and write `journals/` and `pages/`
as separate `.md` files as you type. Point it at a folder inside your cloud
drive and sync is automatic and continuous. This is the nicest setup if your
main machine is a desktop.

### Alternative: a sync server

For an always-on box (Termux on Android, a Pi, a NAS):

```sh
python3 serve.py --vault ~/storage/shared/Documents/OrgMode
# open http://127.0.0.1:8777/
```

Same `.md` files Neovim opens. No auth — keep it on `127.0.0.1` unless you trust
the network.

---

## Corporate environments

- **One file, no dependencies.** Nothing to install, nothing to approve, no CDN,
  no fonts, no analytics, no telemetry.
- **It cannot phone home, and that is enforced, not promised.** The page ships a
  Content-Security-Policy that permits no outbound connection except to
  `localhost` for the optional sync server. Grep it yourself: the only `fetch`
  calls in the file target that server.
- **No service worker, no install required** — email it, drop it on a share,
  open it from disk.
- **Your data stays yours**: markdown you can read, diff and keep in git.

---

## The vault

Each space is a vault with this shape, in its own folder:

```
journals/2026-10-05.md      one file per day
pages/
  _/  0/  1/  2/  3/        project status: cancelled, completed, active, someday, waiting
  a/                        areas of focus   -> [[a/Health]]     (H2)
  g/                        goals            -> [[g/Debt cleared]] (H3)
  c/                        contexts         -> [[c/phone]]
  k/                        checklists       -> [[k/Weekly review]]
  p/  o/                    people, organisations
  z/                        zettel notes
  templates/  verbs/        templates, Phys-Viz verb lexicon
  Horizons.md               purpose and vision (H5, H4)
  GTD.md                    settings: mode, last review, tombstones
```

A project's **status is its directory**. Changing status moves the file and
rewrites every `[[1/Fix sink]]` link in the vault to `[[0/Fix sink]]`.

```markdown
title:: Fix the sink
status:: 1 = active
outcome:: Sink repaired, no drip
area:: [[a/Home]]
updated:: 2026-10-05T09:12:00Z

- Outcome: water goes down, no drip.
- TODO Call the plumber about the leak [[c/phone]]
  Added:: [[2026-10-01]]
  SCHEDULED:: [[2026-10-08]]
- DONE Buy pipe tape [[c/errand]]
  Added:: [[2026-09-10]] - [[2026-09-12]] = 2 days
```

States: `TODO`, `DOING`, `WAIT`, `DONE`, `CANCELLED` (`WAITING`/`CANCELED`/`NOW`/
`LATER` read as aliases). `Added::` is stamped when something becomes a TODO and
closed out with an end date and elapsed days when finished — that number drives
"oldest first" everywhere.

Already have an `.org` vault? It is detected and converted on request; originals
untouched.

---

## The GTD nudges

The point is that vague work is not allowed to sit quietly.

**Nothing is invented for you.** No areas, no contexts, no goals are created
behind your back. Borrowed structure is worse than none, so the app ships empty
and asks.

**Horizons of focus.** David Allen's six altitudes, set up by a wizard the first
time you open Horizons:

| | | |
|---|---|---|
| Horizon 5 | 50,000 ft | Purpose and principles |
| Horizon 4 | 40,000 ft | Vision, three to five years |
| Horizon 3 | 30,000 ft | Goals and objectives, one to two years |
| Horizon 2 | 20,000 ft | Areas of focus — ongoing, never "done" |
| Horizon 1 | 10,000 ft | Projects — outcomes inside a year |
| Ground | runway | Next actions |

The wizard climbs from the concrete to the abstract, because that is the order
people can actually answer in — Allen implements bottom-up even though you review
top-down. Every step is skippable, suggestions are tap-to-add, and nothing is
written until you finish. Re-run it any time from the Horizons view.

Projects hang under areas and goals under areas, so two failures become visible:
**projects in no area** (work nobody owns) and **goals with no project** (wishes).

**Contexts are yours too.** The first time you need one, a wizard asks where work
actually happens for you, offering common ones as suggestions you tap. Nothing is
created unless you pick it.

**Projects stated as outcomes.** A project called *Website* is a noun nobody can
finish; *Website live and taking bookings* is a finish line. Creating a project
asks name, then "what does done look like?", then the next action — the whole
clarify sequence in order. Projects with no stated `outcome::` are flagged in the
nudge bar, in weeding and in the weekly review. New projects start with no
actions at all, so the "no next action" nudge asks you for a real one rather than
inventing a verb-less placeholder from the title.

**Phys-Viz verbs.** A next action must start with a verb a camera could film —
*Call*, *Draft*, *Buy*, *Ring*, *Kjøp*. Anything else is flagged and a picker
offers to rewrite it. The lexicon is markdown you own; English and Norwegian
starter sets install on request.

**Contexts.** Every action wants a `[[c/...]]` link. Setting something to TODO
without one opens the context picker, where single letters `a`–`z` select.

**The surfacing loop.** Pick where you are and GroupTodo shows the **three
oldest** open actions you could actually do there. Never the newest.

**Checklists.** Reusable lists — weekly shop, trip packing, release steps.
Running one copies fresh todos into today or into a project.

**Morning weeding.** Once a day, the three stalest active projects, ranked by: no
next action, then missing context, then missing verb, then idle time.

**Idle nudge** at 30 minutes. **Context re-prompts** at 12:00 and 17:00.

**Project completion.** Close the last action in a project and it will not let it
go quiet: add a next action, or move it to `0`, `2`, or `_`.

**Weekly review.** Eight sections, each with a one-click fix. Marking it done
writes `last_review` into `pages/GTD.md`.

**Health check.** Missing titles, waiting projects with no `waiting_since`,
broken links, duplicate projects with a merge action.

Thresholds live in the `CFG` object near the top of the script.

---

## Keys

Advanced mode keeps the leader chords from the Neovim config.

| | |
|---|---|
| `c` · `/` · `t` · `?` | capture · search · today · key list |
| `g x` / `g d` | pick context / re-surface the oldest three |
| `g w` / `g M` | morning weeding / full morning routine |
| `g r` / `g a` / `g n` | weekly review / agenda / next actions |
| `g m` | change project status |
| `f t` / `f p` / `f n` | today's / previous / next journal |
| `f r` / `f d` | rename / delete page |
| `z n` · `h c` | new zettel · health check |
| `w p` / `w w` / `w m` / `w u` | active / waiting / someday projects, mark reviewed |

In the outline: `enter` new block, `tab`/`shift-tab` indent, `ctrl-enter` cycle
state, `backspace` on an empty block deletes it.

---

## Known limits

- **Block merge matches on text.** Rewording a task on one device while the other
  edits the same page reads as a delete plus an add, so you may see both. Visible
  and fixable, never silent data loss.
- **Deleting a single task does not propagate** — only whole-page deletes carry
  tombstones. A task deleted on one device can return from another.
- **The sync server has no authentication.** Localhost only unless you add one.
- **Spaces are separated, not secured.** Anyone who can open a space's folder or
  file sees all of it. There is no password, and nothing is encrypted.
- **Merged view is opt-in and per device.** Structure views (horizons, review,
  health) stay on the active space even when several are shown.
- **Safari and Firefox are untested by me** (see the table above).
