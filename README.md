# GroupTodo

A Logseq / Microsoft To Do hybrid with explicit GTD nudges, in **one HTML file**, storing
everything as **plain markdown**.

This is a port of a Neovim + org-mode + org-roam GTD config. The vault shape, the
status directories, the Phys-Viz verb rule, the context links, the age tracking and
the morning/weekly rituals all survive the move — only the editor and the file
extension changed.

```
index.html   the whole app: no build step, no dependencies, no network calls
serve.py     optional sync server, so phones and Termux can write the same .md files
```

---

## Run it

**Desktop (Chrome / Edge).** Open `index.html`, click **Vault & sync → Choose vault
folder**, point it at your notes directory. It writes real `.md` files and reconnects
to the same folder next time.

**Phone, Termux, or any other browser.** Those browsers cannot write to a folder on
their own, so run the sync server next to your vault:

```sh
python3 serve.py --vault ~/storage/shared/Documents/OrgMode
# open http://127.0.0.1:8777/
```

The app then reads and writes the same files Neovim opens. No auth: keep it on
`127.0.0.1` unless you trust the network.

**Anywhere else.** It falls back to browser storage and still works offline; use
**Vault & sync → Export bundle** to get your markdown out.

---

## The vault

Identical layout to the org config, with `.md` instead of `.org`:

```
journals/2026-09-17.md      one file per day
pages/
  _/  0/  1/  2/  3/        project status: cancelled, completed, active, someday, waiting
  c/                        contexts   -> [[c/phone]]
  p/  o/                    people, organisations
  z/                        zettel notes
  templates/                journal + project templates, date-cascade resolved
  verbs/<lang>/<verb>.md    the Phys-Viz verb lexicon
  GTD.md                    system settings (last review, current context)
```

A project's **status is its directory**. Changing status moves the file and rewrites
every `[[1/Fix sink]]` link in the vault to `[[0/Fix sink]]`.

## The markdown

Org headings become a bullet outline; `#+key: value` becomes `key:: value`.

```markdown
title:: Fix the sink
status:: 1 = active
created:: [[2026-09-15]]
reviewed:: [[2026-09-17]]

- Outcome: water goes down, no drip.
- TODO Call the plumber about the leak [[c/phone]]
  Added:: [[2026-09-15]]
  SCHEDULED:: [[2026-09-20]]
  - A child block is a sub-action; a parent with open children is not itself actionable.
- DONE Buy pipe tape [[c/errand]]
  Added:: [[2026-09-10]] - [[2026-09-12]] = 2 days
```

States are `TODO`, `DOING`, `WAIT`, `DONE`, `CANCELLED` (`WAITING`/`CANCELED`/`NOW`/`LATER`
are read as aliases). Open states are TODO, DOING and WAIT.

`Added::` is stamped when an item becomes a TODO and closed out with an end date and
an elapsed-day count when it is finished — the same lifecycle the org config wrote
onto its `Added:` line. That number is what drives "oldest first" everywhere.

Already have an `.org` vault? The app lists the `.org` files it finds and offers
**Vault & sync → Convert .org files**. Originals are left untouched.

---

## The GTD nudges

The point of the system is that it does not let vague work sit quietly.

**Phys-Viz verbs.** A next action must start with a verb a camera could film —
*Call*, *Draft*, *Buy*, *Ring*, *Kjøp*. Anything else is flagged `no verb` and a picker
offers to rewrite it. The lexicon is markdown you own: `pages/verbs/en/call.md`
holds `phone = call`, `ring = call`, one synonym per line. English and Norwegian
starter sets install on request.

**Contexts.** Every action wants a `[[c/...]]` link. Setting an item to TODO without
one opens the context picker immediately — single letters `a`–`z` select, like the
letter-key picker in the Neovim config.

**The surfacing loop.** Pick where you are (`g x`) and GroupTodo shows the **three
oldest** open actions in that context, across every active and waiting project plus
loose journal items. Never the newest, never all of them.

**Morning weeding.** Once per day it opens the three stalest active projects, ranked
by: no next action, then missing context, then missing verb, then idle time. Projects
older than six months get told so. Then it asks for your context.

**Idle nudge.** 30 minutes without touching a surfaced action or a meeting, and it
says so.

**Context re-prompts.** At 12:00 and 17:00 it asks where you are now.

**Project completion.** Close the last open action in an active project and it
refuses to let the project go quiet: add a next action, or move it to `0`, `2`, or `_`.

**Weekly review.** Seven sections, each with a one-click fix: stuck projects, journal
actions with no project, missing verbs, missing contexts, projects not reviewed
lately, waiting-for items older than 14 days, someday/maybe. Marking it done writes
`last_review` into `pages/GTD.md`.

**Health check.** Missing titles, waiting projects with no `waiting_since`, broken
`[[links]]`, duplicate project files with a merge action.

All thresholds live in the `CFG` object near the top of the script.

---

## Keys

The leader chords match the Neovim config.

| | |
|---|---|
| `c` | capture |
| `/` | search |
| `t` | today |
| `?` | key list |
| `g x` / `g d` | pick context / re-surface the oldest three |
| `g w` / `g M` | morning weeding / full morning routine |
| `g r` / `g a` / `g n` | weekly review / agenda / next actions |
| `g m` | change project status |
| `f t` / `f p` / `f n` | today's / previous / next journal |
| `f r` / `f d` | rename / delete page |
| `z n` | new zettel |
| `h c` | health check |
| `w p` / `w w` / `w m` / `w u` | active / waiting / someday projects, mark reviewed |

In the outline: `enter` new block, `tab`/`shift-tab` indent, `ctrl-enter` cycle state,
`backspace` on an empty block deletes it.

---

## What did not come across

`init.lua` features that belong to the editor rather than the system: lazy.nvim
bootstrapping, OSC-52 clipboard, telescope pickers, org-roam's node database and
id: links, orgmode's own agenda and capture commands, and the buffer-local insert-mode
editing helpers. Their user-facing jobs — link insertion, backlinks, agenda, capture,
refile, teleport-to-page — are all present as app features instead.
