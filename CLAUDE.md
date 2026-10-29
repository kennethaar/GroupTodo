# GroupTodo

## Version number on every change

`APP_VERSION` near the top of `grouptodo.html` is shown beside the name, top
left. Every change that is pushed raises it: PATCH for a fix, MINOR for a
feature (PATCH back to 0), MAJOR only for a change that breaks existing
vaults. Add the matching entry at the top of `CHANGELOG.md` in the same
commit, and end every reply about a change with the version it is now, e.g.
"Now at **v1.3.2**", so the user knows which file to test.

## Regression battery

`node tests/run.mjs` rebuilds `docs/demo.html`, opens it in headless Edge and
runs `tests/battery.js` inside the page (`node tests/run.mjs <words>` runs
only the tests whose name has them). Run it before every push. A new feature
gets a test in the matching section of `tests/battery.js`; a fixed bug gets
the test that would have caught it, named with its issue number. Never weaken
a test to make it pass: if the app is wrong, fix the app, and if the test's
expectation is out of date, say so to the user.

## Help and its screenshots

The help is data: `HELP` in `grouptodo.html`, one short topic per view,
sub-view and feature. The full help, its search and "This page" (`?`) all
read it. When a change adds or alters a screen, update its topic in the same
commit: `what`, `steps`, `keys`, and the `legend` selectors that "Show me"
points at. A new view or sub-view needs a topic with its `view`/`sub`; the
battery fails without one, and when a legend selector finds nothing.

Help text is short and plain. Use GTD terms when in doubt (capture, clarify,
organise, reflect, engage, next action, context, waiting for, someday/maybe).
Don't use two words when one will do. Keep each topic's LIX below 30 unless a
term requires it; the battery measures it. Then run
`python docs/build-language-catalog.py` so the new words can be translated.

**Screenshots:** topics marked `shot: 1` show `docs/help/<id>.jpg`. Whenever a
page or dialog shown in the help changes, run `node tests/screenshots.mjs`
(or `node tests/screenshots.mjs <id>` for one) and commit the new pictures
with the change. A dialog's topic needs a `SETUP` entry in
`tests/screenshots.mjs` that opens it. The battery fails when a topic has no
picture or a picture has no topic.

## GitHub issues for every change

Log each fix or feature as an issue on `kennethaar/GroupTodo` and reference it
in the commit. Work on `main`, the default branch.

1. Create the issue first, so the commit can say `Fixes #N`.
2. Commit with `Fixes #N` (one per issue, as in earlier commits), then push to
   `main`. GitHub closes the issue on the push.
3. Comment `Fixed in <short-sha>.` on the issue. Close it by hand only when the
   commit went to another branch, since only the default branch auto-closes.

Revisiting something an earlier issue covered (a follow-up fix, a regression,
a tweak to the same behaviour) reuses that issue: search for it, reopen it,
comment on what is being changed, and commit with `Fixes #N` for the same N.
Open a new issue only when the work adds a new feature.

The `gh` CLI is not installed. Use the REST API with the token git already has
stored, never printing it:

```bash
TOKEN=$(printf "protocol=https\nhost=github.com\n\n" | git credential fill | sed -n 's/^password=//p')
H=(-H "Authorization: Bearer $TOKEN" -H "Accept: application/vnd.github+json")
API=https://api.github.com/repos/kennethaar/GroupTodo

# create: build the JSON with node so quotes and newlines are escaped
node -e 'process.stdout.write(JSON.stringify({title:process.argv[1],body:process.argv[2]}))' "Title" "Body" > issue.json
curl -s -X POST "${H[@]}" $API/issues --data-binary @issue.json | grep -m1 '"number"'

# find an earlier issue (open or closed) to revisit
curl -s -G "${H[@]}" https://api.github.com/search/issues --data-urlencode "q=repo:kennethaar/GroupTodo is:issue <words>" | grep -E '"(number|title|state)"'

# reopen and comment
curl -s -X PATCH "${H[@]}" $API/issues/N -d '{"state":"open"}'
curl -s -X POST  "${H[@]}" $API/issues/N/comments --data-binary @comment.json

# after the push: comment, and close only if the push did not
curl -s -X POST  "${H[@]}" $API/issues/N/comments -d '{"body":"Fixed in <sha>."}'
curl -s -X PATCH "${H[@]}" $API/issues/N -d '{"state":"closed","state_reason":"completed"}'
```

Write `issue.json` and `comment.json` (`{"body":"..."}`, built with node the
same way) to the scratchpad, not the repo.

## Design principles

Act as a Principal UI/UX Architect and Cognitive Ergonomics Engineer for
GroupToDo (a local-first, zero-dependency, single-file GTD + Kanban
application). Every UI/UX decision, component layout, and CSS rule must
strictly enforce Getting Things Done (GTD) methodology, Steve Krug's usability
principles ("Don't Make Me Think"), and empirical findings from cognitive
psychology.

### 1. Cognitive psychology constraints

1. **Separate Execution Mode from Review Mode (Context Switching & Attention Residue)**
   - **Rule:** Never mix Weekly Review metadata with Daily Execution views.
   - **Application:** In execution views (`Active` projects, `Next` actions, `Journal`), hide project maintenance metadata (`reviewed Xd ago`, review dates, raw urgency floats like `↑5.6`, and empty field placeholders like `+ people` or `+ organisations`). Expose maintenance metadata only on hover/focus, inside the Weekly Review (`solitaire`) view, or when an explicit "Review Mode" toggle is active.

2. **Cowan's Law of Working Memory (4 ± 1 WIP Limit)**
   - **Rule:** Human working memory holds ~4 chunks concurrently. More than 4–5 active projects induces attention residue (Sophie Leroy) and turns an active column into a vertical backlog.
   - **Application:** Enforce a visual WIP cap (3–5 items) on the `1 / Active` column. Visually warn when exceeded and encourage demoting excess projects to `2 / Someday` or `hold::`.

3. **Implementation Intentions (Gollwitzer's Cue-Action Pairing)**
   - **Rule:** Task execution probability increases significantly when the situational trigger (`@context`) is visually paired right before the physical verb.
   - **Application:** Never bury or truncate `@context` tags at the end of a task string. Render the context pill (`.chip.ctx`) immediately adjacent to the state control (`.tick`) and before the verb-first action title. Never allow CSS `text-overflow: ellipsis` to clip a `@context` pill while empty horizontal space exists on the card.

4. **Von Restorff Effect (Isolation Effect for Color)**
   - **Rule:** When every card carries the same high-contrast colored badge (e.g., amber/orange Area pills), nothing stands out and the brain reads the board as a wall of warnings.
   - **Application:** Render structural categorization (Responsibility `a/`, Area, Parent Project) as quiet, low-contrast uppercase eyebrows (`--fg3`, `11px`, `letter-spacing: .05em`). Reserve saturated semantic colors exclusively for:
     - Interactive task states (`--todo`, `--doing`, `--wait`, `--done`)
     - Situational contexts (`--ctx`)
     - True exceptions (`--late` for overdue, `--warn` for missing next action / blocked).

5. **Endowed Progress Effect vs. Zeigarnik Tension**
   - **Rule:** Showing only `6 open` highlights unfinished burden (Zeigarnik open-loop tension) without showing momentum.
   - **Application:** Pair open counts with completed progress using a compact progress bar (`.pbar`) and ratio (`8/14` or `4 open · 8 done`) so approaching completion accelerates motivation.

### 2. Steve Krug's usability principles ("Don't Make Me Think")

1. **Fix Inverted Visual Hierarchy**
   - In an execution column, the **Next Action** is what the user physically does; the **Project** is the container.
   - Give the physical Next Action row a distinct surface, interactive `.tick` affordance, and high-contrast legibility.
   - Display the project's `outcome::` (what "Done" looks like) directly beneath the project title so topics are never mistaken for finite outcomes.

2. **Eliminate "Question Mark" Metrics & Ambiguous Dates**
   - If a column or list is already sorted by urgency, do not display raw mathematical floats (`↑5.6`, `↑1.2`) by default. Show them only on hover (`.chip.onhover`) with a plain-language tooltip explaining the score.
   - Never display a bare date pill (`søn. 1. nov.`) without its semantic role (`Due Nov 1`, `Starts Nov 1`, or `Hold until Nov 1`).

3. **Management by Exception (Omit Needless Words)**
   - Do not repeat `reviewed 0d ago` on every card. Only surface review age when `idleDays > CFG.reviewEveryDays` (e.g., `stale 14d`).
   - Hide empty-state edit triggers (`+ people`, `+ orgs`, `+ comes after`) from cards until the user hovers, focuses, or enters Review Mode.
   - Never place two competing visual affordances side-by-side for the same action (e.g., a checkbox `[ ]` AND an arrow `→`). Use a single clear state control (`.tick`).

### 3. Card & component anatomy (hierarchy spec)

Every Active Project card (`.bcard`) must follow this 4-tier scannable anatomy from top to bottom:

- **Tier 1 — Eyebrow (Context & Progress):**
  - Left: Status badge (`.st-1`) + Muted uppercase Responsibility/Area breadcrumb (`--fg3`, `11px`).
  - Right: Micro progress bar (`.pbar`) + `done/total` fraction (`font-variant-numeric: tabular-nums`).
- **Tier 2 — Project Title & Finite Outcome:**
  - Title: `15px`, `font-weight: 650`, `--fg`.
  - Outcome (`outcome::`): `12.5px`, `--fg2`, prefixed with `✓` (or a `.chip.miss` warning if `outcome::` is missing).
- **Tier 3 — Primary Action Zone (The Physical Next Action):**
  - Contained box (`background: var(--bg2)`, `border: 1px solid var(--border)`).
  - Left-to-right order: Interactive `.tick` button → Non-truncated `.chip.ctx` (`@pc`, `@home`, `@phone`) → Verb-first task title (`13.5px`, `--fg`).
  - If the project has no open next action, render a high-visibility `.chip.miss` prompt (`+ Add physical next action`) so stuck projects are immediately obvious.
- **Tier 4 — Exception-Only Footer:**
  - Hidden by default if nothing is wrong or delegated.
  - Only renders active exceptions (`late`, `blocked by X`), active collaborators (`avatarNode`), or hover/review-mode metadata (`reviewed Xd ago`, `↑urgency`, `.pfields`).

### 4. Technical & CSS constraints

- **Zero External Dependencies:** Rely strictly on system font stacks (`--sans`, `--mono`) and native CSS variables (`--bg`, `--bg2`, `--bg3`, `--bg4`, `--fg`, `--fg2`, `--fg3`, `--border`, `--border2`, `--accent`, `--todo`, `--doing`, `--wait`, `--done`, `--late`, `--warn`, `--ctx`, `--proj`, `--zet`).
- **Theme Parity:** Every visual state must maintain WCAG AA contrast across all four built-in themes (`Paper`, `Linen`, `Ink`, `Night`) using `color-mix(in srgb, ...)` rather than hardcoded hex alphas.
- **Keyboard & Pointer Parity:** Every card action must be reachable via keyboard (`tabindex="0"`, `Enter`/`Space`, and single-key shortcuts) without requiring hover-only discovery on touch devices.
