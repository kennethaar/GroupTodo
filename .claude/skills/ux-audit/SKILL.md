---
name: ux-audit
description: Walk GroupToDo's UX test battery one feature at a time, find obvious bad UX, recommend fixes, record the user's decisions and turn general ones into UX principles. Resumes from docs/ux/battery.md after /clear. Args - none (next feature), a battery id like E1, "status", or "fix <UX-ids>".
---

# UX audit

State lives in three files. Nothing else is remembered between runs.

- `docs/ux/battery.md` — what to audit and how far we got.
- `docs/ux/findings.md` — every finding and its decision.
- `docs/ux/principles.md` — the rules decided so far.

## Arguments

- *(none)*: audit the first row marked `doing`, else the first `todo`.
- `<battery id>` (e.g. `E1`, `J3`): audit that row.
- `status`: count done/todo per section and list open `accepted` findings
  without an issue. Stop.
- `fix <UX-ids>`: implement those accepted findings. See **Fix mode**.

## Audit one row

Do one row per run, then stop. It keeps the context small and the user in
charge.

1. **Load the rules.** Read `docs/ux/principles.md` in full and the *Product
   and design rules* through *Technical constraints* in `CLAUDE.md`. Every
   finding is judged against these first.
2. **Mark the row `doing`** in `battery.md`.
3. **Read the spec.** For each topic id in the row, read its `HELP` entry in
   `src/js/90-view-state/vars-HELP_PARTS.js` (grep `^  "?<id>"?: \{`). The help
   says what the screen promises. Read the view's render function only if a
   finding needs it.
4. **Look.** Run `node tests/ux-shot.mjs <ids...>` (one run for all the
   row's topics). Read `desktop.jpg`, `phone.jpg` and `dark.jpg` and skim
   `checks.json` in each output folder. For a journey or an interaction (a
   menu, a dialog, a key), add `--js "<code>"` to open it; app functions are
   global (`showTaskDetail`, `openLineMenu`, `go`, ...). Take as many pictures
   as the walk needs, but no more.
   - The checks are hints, not verdicts. Confirm each one in a picture or in
     the code before reporting it. Hover-revealed controls read as low
     contrast; that is fine if they also show on focus.
5. **Judge** with this list, in order. Skip a point that does not apply.
   1. Purpose: within five seconds, is it clear what this is and what to do?
   2. Main action: one obvious control per action? Anything competing?
   3. Empty and first use: what shows with no data? Does it say what to do?
   4. Words: plain, verb-first, purpose-labelled dates, same names as
      elsewhere, no internal terms. Does the help match the screen?
   5. Disclosure: quiet metadata, loud exceptions only (management by
      exception)? Anything shown that could wait for focus or hover?
   6. Feedback and undo: does an action confirm, and can it be undone?
   7. Keyboard: reachable, visible focus, P6.
   8. Touch and phone: targets at least 24 px (44 px for frequent actions),
      no hover-only information, no sideways scroll.
   9. Accessibility: AA contrast in light and dark, every control named.
   10. Consistency: the same pattern works the same way on other screens.
6. **Report only what is obviously bad.** At most 6 findings, worst first.
   For each: a new id `UX-NNN` (continue from the last in `findings.md`),
   severity, what is wrong in one sentence with the evidence (picture or
   `file:line`), and a concrete recommendation that fits the principles. Name
   the principle it applies. Do not pad with taste or nitpicks; if a row is
   fine, say so and move on.
7. **Ask.** Put clear-cut fixes (an AA failure, a broken rule in CLAUDE.md)
   in one list the user can veto in a single answer. Ask with
   `AskUserQuestion` only about real trade-offs, recommended option first,
   at most 4 questions.
8. **Record.**
   - Append each finding to `findings.md` with its decision.
   - A decision that will apply to other screens becomes a principle in
     `principles.md`: next `P` number, the right section, rule / why / apply
     / source (the `UX-` id). If it changes an existing principle, edit that
     one instead of adding a twin.
   - Set the row to `done YYYY-MM-DD` and list its finding ids.
9. **Stop.** End with a short table of the findings and decisions, any new
   principles, and the next row: "Next: `/ux-audit` → <id> <name>".

The audit does not change the app. Fixes come later in fix mode, batched,
so each one gets its own test and issue.

## Fix mode

For `fix <UX-ids>`: follow `CLAUDE.md` in full (issue in
`kennethaar/GroupTodo`, test first, help topic, version, changelog). Group
findings that touch the same screen into one issue. Verify the result with
`node tests/ux-shot.mjs` before reporting. Then write `issue #N` and
`fixed vX.Y.Z` into the finding's decision.

## Keep it lean

- Do not re-audit a `done` row unless asked. If a later fix changes a
  screen, the fix's own check covers it.
- If a finding repeats one already logged, point to the old id instead of
  adding another.
- If a principle turned out wrong, change it and note the finding that
  changed it in its source.
