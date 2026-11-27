# GroupTodo

## Source and navigation

`grouptodo.html` and `icon.svg` are generated. Never edit them directly.
Application source belongs under `src/`.

Use symbol, reference or Tree-sitter search first. Read only the relevant
source, direct dependencies, test and help topic. Expand only when necessary.
Do not explore directories recursively to learn the architecture. Reuse
findings already made in the session.

Run the targeted test first. Widen the investigation only if it fails.

Known entry points:

- `flattenBlocks` sets `_parent` on each block.
- `dueDate(b)` is a line's own date; `effectiveDue(b)` adds the inherited one.
- A date is set from `openDueChipMenu`, `flyPick`, `outlineBlock`,
  `commitLine` and `showTaskDetail`. Change all five together.
- User messages go through `notify(text, kind)`.

- `src/css/NN-name.css`: joined in filename order.
- `src/js/<part>/<name>.js`: one file per function. Related constants may use
  `vars-<first-name>.js`.
- `src/assets/*.svg`: use through `SVG("name")`, `SVG_URI("name")` or
  `<!--@svg-uri:name-->`.
- `src/index.html`: page structure and build markers.
- `src/build-order.txt`: JavaScript assembly order. Add every new JavaScript
  file in dependency order.

Build with:

    node build.mjs

Use `node build.mjs --print` to inspect assembled source and
`node build.mjs --readable` for readable generated output. Generated line
numbers do not match source.

Enable the pre-commit build hook once per clone:

    git config core.hooksPath .githooks

Do not edit generated `HELP_NEWS` or `LANG_CATALOG` values directly. Run the
corresponding script in `docs/`:

- `python docs/build-help-news.py` after editing `CHANGELOG.md`.
- `python docs/build-language-catalog.py` after changing user-facing text.

Then build once. These scripts rewrite `vars-HELP_NEWS.js`,
`vars-nextSpaceColor.js` (holds `LANG_CATALOG`), `languages/English.md` and
`docs/demo.html`. Those diffs are expected. Never `git diff` them in full; use
`git diff --stat`. The `LF will be replaced by CRLF` warnings on those files
are harmless line-ending noise; ignore them and do not try to fix them.

Do not use `git stash` to check whether a failure is pre-existing. It leaves
new untracked files behind and breaks the build. Rerun the failing test alone
instead.

## Versioning

Every pushed change updates `APP_VERSION` in its source file:

- PATCH for fixes and small behavior adjustments.
- MINOR for new user-facing capabilities, resetting PATCH to `0`.
- MAJOR only when existing vaults become incompatible.

Add the matching entry at the top of `CHANGELOG.md` in the same commit. Start
the entry's head with the name of the help topic it belongs to, such as
`Dates and reminders`. What's new links to that topic, and test #256 fails
otherwise.

End every reply about a completed change with:

    Now at **vX.Y.Z**

## Tests

Run focused tests while developing:

    node tests/run.mjs <words>

Run the full battery once before every push, filtered to failures:

    node tests/run.mjs 2>&1 | Select-String "FAIL|passed"

Do not repeat full runs to be sure. If a test fails, rerun only that test.

Known failures (baseline, keep current; checked v1.167.1, 569/577 in the full
run). Fail only in the full run, pass alone (flaky; report and move on):
#172 phone Enter scroll, #267 Repeats dialog, #269 table Enter, #220 both
tests, #221, #233, #346, #190, #291. Fails alone too (real, not yet fixed):
#374 "a mockup pasted right after ``` on a bullet" (the paste became
bullets, 6 not 3). Any other failure is new: suspect the current change.

Every test or shot run makes a throwaway Edge profile, `%TEMP%\gtd-tests-*`
(13-265 MB). `tests/browser.mjs` deletes it on close and sweeps any over an
hour old at each start (`sweepProfiles`). Keep both. They once filled C:, which
showed as slow commands, then `ENOSPC` on every edit. If that happens, check
free space (`df -h /c`) before anything else. Never create browser profiles
outside `openDemo()`.

Rules for writing test fixtures are in `tests/CLAUDE.md`.

Test first. For every behavioral change, write or update the test before
the code, from the requirement or the bug report, never from the
implementation. Run it and see it fail for the expected reason. Then write
the code until it passes. Do not edit the test afterwards to fit the code;
change it only if the requirement itself changed. A bug test includes its
issue number.

Keep the battery lean:

- Search `tests/battery.js` for an existing test of the same behavior first.
  Extend or tighten it instead of adding a near-duplicate.
- One test per behavior. Do not add a test that repeats what another asserts.
- Cover each rule once, with the cases that can fail differently (edge,
  error, regression). Skip cases that follow the same code path.
- When touching an area, merge or delete redundant tests you find there.
  Deleting a duplicate is allowed; weakening a test is not.

Never weaken or bypass a test to make it pass. Fix the application unless the
expectation is demonstrably obsolete.

## Help and screenshots

When user-facing behavior changes, update the matching `HELP` source topic in
the same commit. Update relevant `what`, `steps`, `keys` and `legend` fields.
Use `view` and `sub` only for view-specific topics.

Use short, plain GTD language and keep LIX below 30 when practical.

A topic has at most 6 `steps` and under 90 words before its More fold.
Test #171 enforces both. Count them before building, and when a topic
grows, merge steps instead of adding one. Then run:

    python docs/build-language-catalog.py

A change that brings new GUI also gets a What's new animation: a text script
in `vars-NEWS_ANIM.js`, keyed `version#issue` (format in `newsSteps.js`), drawn
by the app, never video. Keep only the newest 30; delete older ones. Test #471
fails if a key's version has left `HELP_NEWS`: delete that animation. Only
new things get one. Never add an animation for a fix, or to make up a count.
Before adding one, show it to the user as an HTML file that plays it, and
wait for their OK. A script pasted in the reply is not enough. Serve that
file, and every HTML mockup, with `node docs/ux/mockup-serve.mjs <file>`:
the user comments on any part, and the comments land in
`<file>.comments.json` for you to read.

If a topic marked `shot: 1` changes visually, update its screenshot:

    node tests/screenshots.mjs <id>

Run the full screenshot suite only when several screens changed. Dialog topics
need a deterministic `SETUP` entry in `tests/screenshots.mjs`.

## GitHub workflow

Every user-requested change needs an issue in `kennethaar/GroupTodo`.

0. Write issues and comments in generic text: no real names, people,
   employers, products, places or words copied from the user's own data
   or screenshots. Use neutral stand-ins such as "a long word" or
   "Product A".
1. Search existing issues first.
   Before creating an issue or adding to one, show the user its title and
   body and wait for their OK, so they can see the request was understood.
2. Reopen and reuse an issue for a follow-up, regression or related correction.
3. Create a new issue only for distinct new behavior.
4. Each commit references one issue with `Fixes #N`.
5. Push to `main`, always. This holds in cloud sessions too, even when the
   session names a branch of its own: push there as well if you like, but
   `main` is where the work goes.
6. Comment `Fixed in <short-sha>.` on the issue.

The `gh` CLI is unavailable. Use the GitHub REST API with Git's stored token.
Never print or commit the token.

```bash
TOKEN=$(printf "protocol=https\nhost=github.com\n\n" | git credential fill | sed -n 's/^password=//p')
H=(-H "Authorization: Bearer $TOKEN" -H "Accept: application/vnd.github+json")
API=https://api.github.com/repos/kennethaar/GroupTodo
SCRATCH="${TMPDIR:-/tmp}/grouptodo-claude"
mkdir -p "$SCRATCH"
```

Create issue and comment payloads with `JSON.stringify()`. Store temporary JSON only in `$SCRATCH`, never in the repository.

Normalise line endings before every commit. The tree sits in OneDrive and
files turn CRLF while HEAD is LF (`core.autocrlf=false`). Strip CR from each
changed text file whose HEAD copy is LF, then check that `git diff --stat`
shows only real changes:

```bash
for f in $(git diff --name-only); do case "$f" in *.jpg|*.png) continue;; esac
  git show HEAD:"$f" | grep -q $'\r' || sed -i 's/\r$//' "$f"; done
```

Never commit OneDrive conflict copies (`*-LG2375JTB.*`, `*-HY-*.*`).

## Product and design rules

Apply GTD, `Don't Make Me Think`, progressive disclosure, accessibility and management by exception. Do not redesign unrelated parts during a focused change.

Steve Krug's `Don't Make Me Think` rules for every screen:

- Self-evident first: a user should know what a thing is and does without
  thinking. If it needs an explanation, fix the design before adding text.
- Users scan, they don't read. Use clear visual hierarchy, obvious clickable
  things and short labels in the user's words.
- Users satisfice: they click the first reasonable option. Make the right one
  the most obvious one.
- Every click should be a mindless, unambiguous choice. Number of clicks
  matters less than doubt per click.
- Cut words in half, then cut half of what's left. No happy talk or
  instructions nobody reads.
- Follow conventions users already know unless a new way is clearly better.
- Always show where the user is and how to get back.
- Keep the user's goodwill: no hidden needed info, no forced format, easy
  recovery from mistakes.

Always suggest UI and UX best practices, for new features and when a task
touches or revisits an existing one. List the problems you see and the fix
you recommend, briefly. Suggestions outside the task stay suggestions:
build them only after the user agrees.

Before changing user-facing text or UX, show the user 3 mockups and wait for
their pick. Build nothing until they approve.

Before any UX change, read `docs/ux/principles.md` and follow it; add a new
decision there when it applies beyond one screen. The UX audit runs with
`/ux-audit` (state in `docs/ux/battery.md` and `findings.md`). Check a screen
with `node tests/ux-shot.mjs <help-topic>`.

## Execution views

In `Active`, `Next` and `Journal`, hide review metadata, raw urgency and empty fields by default. Show them on focus, hover, Review Mode or when they represent an exception.

Hover-only information must also be available through focus or an explicit touch-accessible action.

Use a visual WIP target of three to five projects in `1 / Active`. Warn when exceeded, but never move user data automatically.

## Next actions and cards

Render a next action in this order:

1. `.tick`
2. `.chip.ctx`
3. Verb-first action title

Do not truncate the context while horizontal space remains.

An Active Project card follows this hierarchy:

1. Status, quiet area or responsibility, and `done/total` progress.
2. Project title and finite `outcome::`.
3. Distinct next-action surface, or `+ Add physical next action`.
4. Exceptions such as overdue, blocked, collaborators or stale review.

Use saturated colors only for task states, contexts and true exceptions. Render structural metadata quietly.

Label dates by purpose, such as `Due`, `Starts` or `Hold until`. Do not show unexplained urgency scores. Show review age only when stale.

Use one clear control per action.

## Technical constraints

1. No external runtime dependencies.
2. Preserve compatibility with existing vaults.
3. Maintain WCAG AA across Paper, Linen, Ink and Night.
4. Prefer existing CSS variables and `color-mix(in srgb, ...)`.
5. Prefer native interactive elements over `tabindex` on non-interactive ones.
6. Support pointer, keyboard and touch.
7. Add migration and regression coverage when changing stored data.

## Ongoing work (keep short; update as work moves on)

Every 10th `/clear`, the SessionStart hook `.claude/hooks/clear-count.mjs`
asks for this section to be compacted: repeats merged, stale items dropped.

Work happens on `main`.

Newest areas, look here first for regressions: Present (`src/js/91-present/`):
camera (`slideCam*`, #485), Alt+drag (`slideArr*`, #487), map slides (#488),
waiting screen (`slideWait*`, #486), charts (#482), Copy for AI › Slides
(`slideAi*`, #483), refs/embeds (#470), presenter window (#489, v1.223.0).
Also: Continue where you left off (`lastPlace*`, #492), pasted updates
(`pastedUpdate`, #373), importer on first start (#458).

Open: #456 (parked, do not start). Unfiled: pinned page dragged from the
sidebar onto a line fails before the first click after reload (would reopen
#448; not reproduced in the demo). Slow start (#181, closed): staged read
(`readDayFirst`, `readActiveFirst`, `readFolderBehind`); reopen if slow.
