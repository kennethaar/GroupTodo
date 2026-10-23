# GroupToDo vault format

This file describes exactly how GroupToDo stores its data, so that a person or
an AI assistant can convert an existing Obsidian or Logseq vault into one.

## How to use this with an AI

Give your assistant this whole file plus a sample of your vault (a few daily
notes, a project page, a person page), and ask:

> Using the GroupToDo vault format below, write a script that converts my
> [Obsidian | Logseq] vault at `<path>` into a GroupToDo vault at `<new path>`.
> My name is `<First Last>`. Never modify the source vault. Print a summary of
> what was converted and list anything it could not map.

Then open GroupToDo, **Choose folder**, and point it at the new folder.
Always convert into a **new, empty folder**, never in place.

---

## 1. Folder layout

An *area* (Work, Home, …) is one folder. Areas never share or nest folders.

```
<area>/
  journals/<Person Name>/YYYY-MM-DD.md   one file per person per day
  pages/
    1/   active projects          [[1/Fix sink]]
    2/   someday / maybe          [[2/Learn Spanish]]
    3/   waiting for third party  [[3/Roof repair]]
    0/   completed projects       [[0/Move office]]
    -/   cancelled projects       [[-/Old idea]]
    _/   horizons: _/Purpose.md (H5), _/Vision.md (H4)
    g/   goals, 1–2 years (H3)    [[g/Debt cleared]]
    a/   areas of focus / responsibilities (H2)  [[a/Health]]
    8/   checklists, routines and templates      [[8/Weekly review]]
    c/   contexts                 [[c/phone]]
    p/   people                   [[p/Ola Nordmann]]
    o/   organisations            [[o/Acme AS]]
    z/   notes (zettelkasten)     [[z/Spaced repetition]]
    verbs/  verb lexicon (optional)
    <anything else>.md            plain pages, [[Recipe ideas]]
```

- **The folder is the kind of page.** A file's folder decides whether it is a project, a person, a context, and so on. Nothing else marks it.
- **A project's status is its folder.** Move the file to change its status.
- **The link is the path without `pages/` and `.md`**: `pages/1/Fix sink.md` is `[[1/Fix sink]]`.
- **File names are the page title**, with `/ \ : * ? " < > |` and control characters replaced by `-` and runs of whitespace collapsed to one space. Keep spaces and capitals; do not slugify further.
- **Journals** are `journals/<Person Name>/YYYY-MM-DD.md`, with the person's full name as the folder name (max 40 characters, same character rules). A day page is linked as `[[2026-10-05]]`.
- Files the app writes for itself and never reads as pages: `pages/**/_<x>_for ….md` and `_GroupToDo_for this folder.md`. Do not create these yourself.
- `pages/8/todo.md`, `pages/8/1.md` and similar are templates the app creates when they are missing. Do not create them yourself.
- `pages/8/Languages/<Language>.md` are the app's words in other languages, one `English => translation` line each. They are not pages; the app writes `English.md` itself.

## 2. A page

UTF-8 markdown. **Page properties first**, as `key:: value` lines, then a blank
line, then **a bullet outline**. No YAML front matter.

```markdown
title:: Fix the sink
outcome:: Sink repaired, no drip
area:: [[a/Home]]
org:: [[o/Acme AS]]
with:: [[p/Alice Berg]]
depends_on:: [[1/Survey the bathroom]]
created:: 2026-10-01

- TODO Call the plumber about the leak [[c/phone]]
  Added:: [[2026-10-01]]
  by:: Kenneth Aar
  SCHEDULED:: [[2026-10-08]]
  DEADLINE:: [[2026-10-15]]
- TODO Chase the quote [[c/phone]]
  assigned:: Alice Berg
- DONE Buy pipe tape [[c/errand]]
  Added:: [[2026-09-10]]
  CLOSED:: [[2026-09-12]]
  done_by:: Kenneth Aar 2026-09-12T14:03:00Z
- Notes from the call
  The left valve is the old type.
  - A child line, indented two spaces
```

Parsing rules:

- A **bullet** is `-`, `*` or `+` followed by a space. Indent is **two spaces per level** (a tab counts as two).
- `key:: value` lines **before the first bullet** are page properties. Keys start with a letter and may contain letters, digits, `_` and `-`.
- `key:: value` lines **indented under a bullet** are that bullet's properties.
- Other indented lines under a bullet are its **body** (multi-line note).
- Prose before the first bullet becomes a top-level line. Headings are not special: `# Heading` is read as a line whose text is `# Heading`. For a clean result, **turn headings and paragraphs into bullets**, with nesting reflecting the heading structure.
- `#tag` anywhere in a line is a tag. `[[link]]`, `[[link|label]]` and `[[link#heading]]` are links.

## 3. Tasks

A task is a bullet whose text starts with a state word:

| State | Meaning |
|---|---|
| `TODO` | to do |
| `DOING` | in progress |
| `WAIT` | waiting on somebody |
| `DONE` | finished |
| `CANCELLED` | dropped |

`WAITING`, `CANCELED`, `NOW` and `LATER` are read as aliases. A bullet with no state is an ordinary note.

Task properties (all optional):

| Property | Value | Meaning |
|---|---|---|
| `Added::` | `[[YYYY-MM-DD]]` | when it was captured; drives "oldest first" |
| `by::` | `Full Name` | who wrote it |
| `assigned::` | `Full Name` | who does it; absent means the author. A name outside the area should go with state `WAIT` |
| `SCHEDULED::` | `[[YYYY-MM-DD]]` | start date |
| `DEADLINE::` | `[[YYYY-MM-DD]]` | due date |
| `started::` | `YYYY-MM-DD` | when it became DOING |
| `CLOSED::` | `[[YYYY-MM-DD]]` | when it was finished or cancelled |
| `done_by::` | `Full Name YYYY-MM-DDTHH:MM:SSZ` | who ticked it off, and when (used by reports) |
| `repeat::` | `weekly`, `monthly`, `every 2 weeks`, `every monday` | offered again when ticked off |
| `id::` | short id | stable anchor for links; keep if present |

Where things are said on the line itself:

- **Context**: `[[c/phone]]` in the task text. One context per task.
- **Project**: either the task sits on the project's page, or its text (or a parent bullet's) links to it: `- TODO Order parts [[1/Fix sink]]`. Put tasks on the project page where possible.
- **Person to ask**: `[[p/Name]]` in the text, e.g. `ask [[p/Ola Nordmann]] about the budget`.
- **Tags**: `#urgent`, `#q4`.
- Start a next action with a physical verb ("Call", "Draft", "Buy"). The app nudges otherwise.

## 4. Page kinds and their properties

| Folder | Kind | Typical page properties |
|---|---|---|
| `1/ 2/ 3/ 0/ -/` | project | `title`, `status` (e.g. `1 = active`), `outcome` (what done looks like), `area:: [[a/…]]`, `goal:: [[g/…]]`, `org:: [[o/…]]`, `with:: [[p/…]], [[p/…]]`, `depends_on:: [[1/…]], [[1/…]]`, `waiting_for::`, `created`, `reviewed` |
| `p/` | person | `title`, `type:: person`, `member:: true` (only for people who use GroupToDo in this area), `aliases:: JS, Johnny` (short names; `[[p/John Smith][JS]]` reads as JS) |
| `o/` | organisation | `title`, `type:: org`, `aliases:: Storebrand` (short names, as for people) |
| `c/` | context | `title`, `type:: context` |
| `a/` | responsibility | `title`, `type:: area` |
| `g/` | goal | `title`, `type:: goal`, `horizon:: 3` |
| `8/` | checklist / routine | `title`, `type:: checklist`, `cadence:: weekly` (makes it a routine), `kind:: project` (running it creates a project), `kind:: states` (stages of a task type) |
| `_/` | horizon | `type:: horizon` |
| `journals/` | day page | `title:: YYYY-MM-DD`, `created:: [[YYYY-MM-DD]]` |

Values that link to pages are written as `[[prefix/Name]]`, comma-separated
when there are several. Dates are ISO `YYYY-MM-DD`, wrapped in `[[ ]]` where
the tables above show it.

Other line formats:

```markdown
- #meeting Planning with Ola
  time:: 13:00–14:00
  attendees:: [[p/Ola Nordmann]], [[p/Per Dahl]]
  - Budget
```

```markdown
tracker-pullups:: 100/8/4/2        (page property at the top of a day page)
tracker-office_t:: 07:12 - 10:00, 10:30 - 12:30 (hours, one per place: start and end; "07:12 -" is still running)
tracker-food_a:: 129,50 + 45       (an amount)
tracker-paint_q:: +3               (stock: +3 in, -1 out, =12 counted)
```

How the sheets add these up is on your own person page:

```markdown
hours_target:: mon-thu 7.5, fri 7
amounts_split:: Home 50, Work 50
hours_extra:: 1
hours_format:: 0,00
hours_trackers:: office, home
amounts_unit:: kr
```

A todo that has been Doing carries Logseq's clock, which the Clients sheet adds up
per project organisation (`org::` on the project page or its area):

```markdown
- DONE Draft the offer [[1/Acme website]]
  :LOGBOOK:
  CLOCK: [2026-10-23 Fri 09:02:11]--[2026-10-23 Fri 10:47:30] =>  01:45:19
  :END:
```


```markdown
- Numbers are in the shared sheet          (a comment on the task above it,
  msg:: Kenneth Aar                         as a child bullet)
  at:: 2026-10-07T19:05:39Z
```

```markdown
- {{embed [[1/Fix sink]]}}                 (shows that page here, live)
- {{embed ((k3x9a2qd))}}                   (shows the line with id:: k3x9a2qd)
- Ask about ((k3x9a2qd)) on Monday         (reads as that line's words)
- {{query (and [[1/Fix sink]] (task TODO DOING))}}   (a live list of matching lines)
```

Queries are Logseq's simple queries: `[[page]]`, `#tag`, `"words"`,
`(task TODO DOING)`, `(page "name")`, `(property key value)`,
`(page-property key value)`, `(between -7d today)`, and `and`, `or`, `not`
around them. Anything else (`sort-by`, `priority`) is read and ignored.

A **namespace** is a page in a folder of its own, `pages/Work/Clients.md`
linked as `[[Work/Clients]]`, or a plain page whose name has parts,
`pages/Work - Clients.md`. Either way the page lists the rest of its family.

---

## 5. Converting from Logseq

Logseq is already a bullet outline with `key:: value` properties, so most of
it carries over unchanged.

| Logseq | GroupToDo |
|---|---|
| `journals/2026_10_05.md` | `journals/<Your Name>/2026-10-05.md` |
| `pages/Fix sink.md` with `tags:: project` (or your own project marker) | `pages/1/Fix sink.md`; use `2/`, `3/`, `0/`, `-/` for other statuses |
| page that is a person / company / context | `pages/p/`, `pages/o/`, `pages/c/` |
| other pages | `pages/<Name>.md`, or `pages/z/` for notes |
| namespace file `pages/Work___Clients.md` (`[[Work/Clients]]`) | flatten to `pages/Work - Clients.md` and rewrite links, unless the first part maps to a GroupToDo prefix |
| `TODO` `DOING` `DONE` `NOW` `LATER` `WAITING` `CANCELED` | unchanged (aliases are read) |
| `SCHEDULED: <2026-10-08 Thu>` | `SCHEDULED:: [[2026-10-08]]` |
| `DEADLINE: <2026-10-15 Thu .+1w>` | `DEADLINE:: [[2026-10-15]]` and `repeat:: weekly` |
| `:LOGBOOK:` … `:END:` | drop, or keep the first CLOCK date as `started::` |
| `[[Oct 5th, 2026]]` (date links in your journal format) | `[[2026-10-05]]` |
| `[[Fix sink]]` | `[[1/Fix sink]]` once the page has moved |
| `@phone`, `#phone` or `[[phone]]` used as a context | `[[c/phone]]` |
| `((block-uuid))` block references | unchanged; keep the `id::` on the line it points at |
| `{{embed [[page]]}}`, `{{embed ((uuid))}}`, `{{query …}}` | unchanged; rewrite the `[[link]]` inside like any other |
| `collapsed:: true` | can be dropped |
| `id::` | keep |
| `assets/` images | keep `assets/` next to the vault; links stay as text |

## 6. Converting from Obsidian

Obsidian notes are free-form markdown, so the main work is **turning them into
an outline** and **moving front matter into `key::` lines**.

| Obsidian | GroupToDo |
|---|---|
| YAML front matter `---` … `---` | one `key:: value` line per field before the first bullet; lists become comma-separated `[[links]]` where they refer to pages |
| Daily notes folder, `2026-10-05.md` (any date format) | `journals/<Your Name>/2026-10-05.md` |
| headings and paragraphs | bullets: a heading becomes a bullet, the content under it becomes child bullets |
| `- [ ] task` | `- TODO task` |
| `- [/] task` | `- DOING task` |
| `- [x] task` | `- DONE task` |
| `- [-] task` | `- CANCELLED task` |
| Tasks plugin `📅 2026-10-15` | `DEADLINE:: [[2026-10-15]]` |
| `⏳ 2026-10-08` or `🛫 2026-10-08` | `SCHEDULED:: [[2026-10-08]]` |
| `➕ 2026-10-01` | `Added:: [[2026-10-01]]` |
| `✅ 2026-10-12` | `CLOSED:: [[2026-10-12]]` |
| `🔁 every week` | `repeat:: weekly` |
| `⏫ 🔼 🔽` priorities | a tag such as `#high`, or drop |
| Dataview inline `key:: value` | already the same syntax: move it under its bullet |
| notes tagged or foldered as projects | `pages/1/…` (or the matching status folder) |
| people, companies | `pages/p/`, `pages/o/` |
| other notes | `pages/<Name>.md`, or `pages/z/` |
| `[[Note]]`, `[[Note\|alias]]`, `[[Note#Heading]]` | same syntax; rewrite the target to its new prefix, e.g. `[[p/Note]]` |
| `![[Note]]` (embedding a note) | `{{embed [[Note]]}}` |
| `^block-id` and `[[Note#^block-id]]` | `id:: block-id` on the bullet; links become `[[Note]]` |
| attachments | keep the folder next to the vault; links stay as text |
| `.obsidian/`, `.trash/` | skip |

## 7. Converter checklist

1. Write to a new folder; never touch the source.
2. Decide each page's kind and move it into the matching folder.
3. Build a map from old name to new link (`Fix sink` → `1/Fix sink`) and rewrite every `[[link]]` with it. Match names case-insensitively.
4. Convert dates to `YYYY-MM-DD`, and date links to `[[YYYY-MM-DD]]`.
5. Make every page: properties, blank line, bullet outline with two-space indents.
6. Convert task syntax and dates into state words and task properties.
7. Turn context markers into `[[c/…]]` and create a page in `pages/c/` for each.
8. Create `pages/p/<Your Name>.md` with `member:: true`.
9. Use LF or CRLF line endings, UTF-8, and end each file with a newline.
10. Report pages it could not classify, links it could not resolve, and syntax it dropped.

Things GroupToDo has no equivalent for, which the converter should flatten or
drop: advanced (Datalog) queries, Canvas files, plugin-specific blocks and
per-page CSS.
