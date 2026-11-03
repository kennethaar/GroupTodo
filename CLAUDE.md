# GroupTodo

## Source and navigation

`grouptodo.html` and `icon.svg` are generated. Never edit them directly.
Application source belongs under `src/`.

Use symbol, reference or Tree-sitter search first. Read only the relevant
source, direct dependencies, test and help topic. Expand only when necessary.

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
corresponding script in `docs/`.

## Versioning

Every pushed change updates `APP_VERSION` in its source file:

- PATCH for fixes and small behavior adjustments.
- MINOR for new user-facing capabilities, resetting PATCH to `0`.
- MAJOR only when existing vaults become incompatible.

Add the matching entry at the top of `CHANGELOG.md` in the same commit.

End every reply about a completed change with:

    Now at **vX.Y.Z**

## Tests

Run focused tests while developing:

    node tests/run.mjs <words>

Run the full battery before every push:

    node tests/run.mjs

Add or update a regression test for every behavioral change. A bug test
includes its issue number.

Never weaken or bypass a test to make it pass. Fix the application unless the
expectation is demonstrably obsolete.

## Help and screenshots

When user-facing behavior changes, update the matching `HELP` source topic in
the same commit. Update relevant `what`, `steps`, `keys` and `legend` fields.
Use `view` and `sub` only for view-specific topics.

Use short, plain GTD language and keep LIX below 30 when practical. Then run:

    python docs/build-language-catalog.py

If a topic marked `shot: 1` changes visually, update its screenshot:

    node tests/screenshots.mjs <id>

Run the full screenshot suite only when several screens changed. Dialog topics
need a deterministic `SETUP` entry in `tests/screenshots.mjs`.

## GitHub workflow

Every user-requested change needs an issue in `kennethaar/GroupTodo`.

1. Search existing issues first.
2. Reopen and reuse an issue for a follow-up, regression or related correction.
3. Create a new issue only for distinct new behavior.
4. Each commit references one issue with `Fixes #N`.
5. Push to `main`.
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

## Product and design rules

Apply GTD, `Don't Make Me Think`, progressive disclosure, accessibility and management by exception. Do not redesign unrelated parts during a focused change.

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
