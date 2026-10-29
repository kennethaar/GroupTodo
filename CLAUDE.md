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
