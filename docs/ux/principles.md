# UX principles

Decisions about how GroupToDo should feel, written as rules so the next
change does not have to argue them again. Read this before any UX change or
audit. When a decision applies beyond one screen, add it here.

The **Product and design rules** in `CLAUDE.md` (execution views, cards,
technical constraints) are binding and are not repeated here. This file holds
the decisions made since, and the reasons.

Each principle: a rule, why, how to apply it, and where it came from. Keep
each one short. When two principles disagree, the newer decision wins; then
edit the older one so they no longer disagree.

## Words and labels

**P1. Say "area", never "space".** Internal names never reach the screen.
*Why:* `space` is a code word; users know areas. *Apply:* check new strings for
`space`. Fix the logic behind a complaint before touching labels.
*Source:* user decision, 2026-10-28.

**P2. Name a button by what it does, and say it once.** No body text that
repeats the title. *Why:* "Use server" confused; "One folder per area" under a
title saying the same was noise (#193). *Apply:* verb + object labels; cut
notes that restate the heading. *Source:* #193.

**P10. One place, one name.** A dialog or view is titled with the same words
that help, buttons and links use to reach it. *Why:* "Vault & sync" opened a
dialog titled "Settings", while a different "Settings" sat in the sidebar.
*Apply:* when naming or renaming a place, grep help and strings for the old
name. *Source:* UX-006.

**P11. A placeholder never looks like a value.** Use a word ("From", "Name")
or a clearly fake example, never a plausible setting. *Why:* "08:43 – 08:43"
read as hours already set, and wrong. *Apply:* check empty fields in pictures,
not only filled ones, and fix shared inputs (`clockInput`) at the source.
*Source:* UX-005, UX-017.

**P12. Name the place, never the file; show words, never storage.** Say
where something is in the words the app uses ("Journal · Sat 7 Nov", a
page's title), never as a path like `journals/…/2026-11-07.md`. The same for
what is stored inside a file: no `[[p/Name]]`, `c/`, `key::` or state codes
like `TODO` on screen; show the name, the `@context`, the plain word.
*Why:* a path or a code is storage, not something the user knows; the task
panel showed `[[p/Nora Vik]]` and `WAIT` where lists said "Nora Vik" and
"Waiting". *Apply:* search hits, links, backlinks, errors, edit boxes,
buttons that set a stored value. Show a path only where the user manages
files, such as Vault & sync. *Source:* UX-009, UX-012, UX-013.

## Choosing and settings

**P3. Pick, don't type.** A setting with known values is a list with the
current one marked, then "Another value", then "Take it off" last. No
"Change it / Take it off" menu first, no typing `key:: value`.
*Why:* typing and two-step menus felt like extra work (#137). *Apply:* reuse
`timerSettingMenu` / `openContextChipMenu`. *Source:* #137.

**P4. Offer only what can work now.** Hide a choice until its precondition
holds. *Why:* a dead option makes people guess what it means. *Apply:* gate
buttons on the real condition, not on a setting. *Source:* #193.

**P5. Detect, then ask.** When reading someone's existing setup (symbols,
tags, folders), show what was found and let them say what it means. Never
preselect one person's conventions. *Why:* #288 baked in the user's own
mapping for everyone. *Source:* #288.

## Navigation

**P15. A switch holds readings; a way back sits above the title.** A
view's segmented switch lists only that view's own readings. A link back to
where you came from is a quiet `‹ Place` link above the title, never a
button in the switch. *Why:* the review switch read "‹ Projects · … ·
Projects", one word for two jobs side by side. *Apply:* Weekly review,
Contexts, and any view opened from another. *Source:* UX-015.

**P17. One main button per dialog, and every step has Back.** The footer
holds Cancel and the one thing the dialog is for. Options only some people
need fold under More. Receiving (Paste a reply) sits apart from sending. A
step that follows another has `◂ Back`, which returns with the choices kept.
*Why:* Ask for an update ended in five buttons, and its note step had no way
back to the lines. *Apply:* wizards, reviews and multi-step dialogs.
*Source:* #363.

## Phone

**P16. On a phone the words get the width.** A row's title wraps over
the full width and is never cut to "…"; its chips go on a line under it.
Tools get a row of their own, and anything tapped is a full-width row or
at least 44px. Show a bar, not a bare number. *Why:* Chores on a phone
showed "Gi m…" beside a "1000%" chip that ran off the edge. *Apply:* any
list read on a phone. Check at 390px. *Source:* #343.

## Keyboard

**P6. Letters search, arrows move.** Letters jump to the option whose name
starts with them; arrows and number keys move (numbers laid out like the
screen). Never bind W/A/S/D or any letter to movement. *Why:* letters must stay
free for names. *Source:* user decision, 2026-10-16.

## Data and trust

**P7. Never change the user's names or data on their behalf.** No automatic
renames, moves or merges; suggest and let them do it. *Why:* an onboarding fix
renamed an area after its folder and the user objected. *Source:* 2026-10-28.

**P13. Only symbols are commands; never cut words from a sentence.** A
plain word stays text. A context, person or project comes only from `@`, `#`
or a picker. Dates are the one exception, because their grammar is clear
("tomorrow", "in 3 days"), and they can be undone with Keep the words. The
sentence is always kept whole: an `@tag` stays where it was typed, as a
quiet inline link, and that is the one place a row says it. No chip
repeats it. A plain word that matches a context, person, organisation or
project is offered as a suggestion, and the pick makes it a link.
*Why:* "milk for the office" became "@office milk for the". Contexts are
ordinary nouns, so guessing them gives false positives and broken
English; a chip beside the link said everything twice. *Apply:* capture,
the outline and paste. Example text must show input people should really
type. *Source:* UX-007, revised by the user after v1.112.2.

**P18. What the machine needs stays out of what you edit.** Text you
write or reword shows only words meant for people. References, ids and
other text the app reads back are shown read-only next to it, said to be
added automatically, and put back when it goes. *Why:* the ask note mixed
`Reference (leave as is): Work-…` lines into the message, where one stray
edit would cut the reply off from its task. *Apply:* any message, export or
template that carries ids. *Source:* #372.

**P14. Capture views keep the order you wrote; doing views group.** The
Journal shows lines as written, in the order written, and never groups
by context, on any screen. Next is for doing, so it groups by context, one
header per context with its count, the group with the most urgent action
first; the header is a button that shows that context alone. *Why:* the
Journal is where things are got out of your head; sorting belongs where you
pick what to do. *Apply:* any list: decide first whether it is for
capture or for doing. *Source:* UX-007 follow-up, 2026-11-07.

## Building

**P8. Grow an existing feature before adding a new one.** New kinds of data
(hours, expenses, stock) extend trackers or properties with a small
definition, not a parallel system. *Why:* one mechanism to learn; reusable
logic (#12). *Source:* #12.

**P9. Judge layout in the real app.** Verify UI changes in `docs/demo.html`
(`node tests/ux-shot.mjs <topic>`), never in a mock page. *Why:* a mock missed
a global `.big` class and the same bug shipped twice. *Source:* 2026-10-29.
