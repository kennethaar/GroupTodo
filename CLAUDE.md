# GroupTodo

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
