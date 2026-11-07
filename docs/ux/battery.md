# UX test battery

The list of things the UX audit walks through, one per run, top to bottom.
`/ux-audit` picks the first row marked `todo`. This file is the audit's memory:
after a `/clear` the next run starts from here.

- **Status**: `todo`, `doing` (started, not finished), `done YYYY-MM-DD`, or `skip`.
- **Topics**: help topic ids in `HELP` (`src/js/90-view-state/vars-HELP_PARTS.js`).
  They are the screen's spec and what `node tests/ux-shot.mjs <id>` opens.
- **Findings**: ids in [findings.md](findings.md).

Journeys come first: bad UX often sits between screens, not on them.
Then screens in GTD order: capture, clarify, organise, engage, reflect.

## Journeys

| # | Item | Topics | Status | Findings |
|---|------|--------|--------|----------|
| J1 | First ten minutes: empty vault to first next action | start, vault, gtd, topbar | done 2026-11-07 | UX-001 – UX-006 |
| J2 | Capture fast, on PC and phone, and find it again | topbar, journal, phone | done 2026-11-07 | UX-007 – UX-011 |
| J3 | Clarify the inbox into projects and next actions | review-days, task, states | done 2026-11-07 | UX-012 – UX-017 |
| J4 | Pick and finish a next action where you are | next-list, next-board, contexts | todo | |
| J5 | Weekly review end to end | review-steps, review-projects, review-actions, review-reflect | todo | |
| J6 | Keyboard only: one capture, one clarify, one done | keys, keys-line, keys-review | todo | |
| J7 | Consistency sweep: names, buttons, empty states across views | all views | todo | |

## Capture and write

| # | Item | Topics | Status | Findings |
|---|------|--------|--------|----------|
| C1 | Top bar and quick add | topbar | todo | |
| C2 | Journal (today) | journal | todo | |
| C3 | Journal week | journal-week | todo | |
| C4 | Writing a line: states, dates, urgency | states, dates, urgency | todo | |
| C5 | Line menu and toolbar | linemenu | todo | |
| C6 | Links, aliases, pins | links, pins | todo | |
| C7 | Events and feelings | bujo | todo | |
| C8 | Queries and embeds | queries | todo | |

## Clarify

| # | Item | Topics | Status | Findings |
|---|------|--------|--------|----------|
| L1 | A task's panel | task | todo | |
| L2 | Hold and until | hold | todo | |
| L3 | Repeat and routines | repeat | todo | |
| L4 | Review: clarify days | review-days | todo | |

## Organise

| # | Item | Topics | Status | Findings |
|---|------|--------|--------|----------|
| O1 | Projects list | projects-list | todo | |
| O2 | Projects board (Active WIP) | projects-board | todo | |
| O3 | Projects timeline, report, hours | projects-timeline, projects-report, projects-hours | todo | |
| O4 | Natural planning | plan | todo | |
| O5 | Contexts and sorting | contexts, contexts-sort | todo | |
| O6 | People | people-list, people-cards, people-board | todo | |
| O7 | Organisations | orgs-list, orgs-board | todo | |
| O8 | Areas and sharing | areas, sidebar | todo | |
| O9 | Horizons | horizons | todo | |
| O10 | Pages: list, board, tree | pages-list, pages-board, pages-tree | todo | |
| O11 | Pages: mind map, graph | pages-mindmap, pages-graph | todo | |
| O12 | A page, your page | page, me | todo | |

## Engage

| # | Item | Topics | Status | Findings |
|---|------|--------|--------|----------|
| E1 | Next list | next-list | todo | |
| E2 | Next board | next-board | todo | |
| E3 | Next calendar | next-calendar | todo | |
| E4 | Waiting for | waiting-list, waiting-board | todo | |
| E5 | Chat | chat | todo | |
| E6 | Chores | chores | todo | |
| E7 | Timer | timer | todo | |
| E8 | Trackers, time, prices | trackers, tracking, prices | todo | |
| E9 | Search | search | todo | |

## Reflect

| # | Item | Topics | Status | Findings |
|---|------|--------|--------|----------|
| R1 | Weekly review steps | review-steps | todo | |
| R2 | Review projects | review-projects | todo | |
| R3 | Review actions | review-actions | todo | |
| R4 | Reflect | review-reflect | todo | |

## Setup, storage, help

| # | Item | Topics | Status | Findings |
|---|------|--------|--------|----------|
| S1 | Vault and sync dialog | vault, run | todo | |
| S2 | Phone and PC | phone | todo | |
| S3 | Settings | settings | todo | |
| S4 | Help and What's new | help, news | todo | |

## Book

| # | Item | Topics | Status | Findings |
|---|------|--------|--------|----------|
| B1 | Chapters and writing a chapter | book, chapter | todo | |
| B2 | Revise and read | book-revise, book-read | todo | |
| B3 | Plot, timeline, relations, cast | book-plot, book-timeline, book-relations, book-cast | todo | |
