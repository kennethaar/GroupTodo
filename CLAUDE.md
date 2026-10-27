# GroupTodo

## GitHub issues for every change

Log each fix or feature as an issue on `kennethaar/GroupTodo`, reference it in
the commit, and close it once pushed.

1. Create the issue first, so the commit can say `Fixes #N`.
2. Commit with `Fixes #N` (one per issue, as in earlier commits), then push.
3. Comment `Fixed in <short-sha> on <branch>.` and close the issue as completed.
   Pushing to a branch other than the default does not auto-close it.

The `gh` CLI is not installed. Use the REST API with the token git already has
stored, never printing it:

```bash
TOKEN=$(printf "protocol=https\nhost=github.com\n\n" | git credential fill | sed -n 's/^password=//p')
H=(-H "Authorization: Bearer $TOKEN" -H "Accept: application/vnd.github+json")
API=https://api.github.com/repos/kennethaar/GroupTodo

# create: build the JSON with node so quotes and newlines are escaped
node -e 'process.stdout.write(JSON.stringify({title:process.argv[1],body:process.argv[2]}))' "Title" "Body" > issue.json
curl -s -X POST "${H[@]}" $API/issues --data-binary @issue.json | grep -m1 '"number"'

# close
curl -s -X POST  "${H[@]}" $API/issues/N/comments -d '{"body":"Fixed in <sha> on <branch>."}'
curl -s -X PATCH "${H[@]}" $API/issues/N -d '{"state":"closed","state_reason":"completed"}'
```

Write `issue.json` to the scratchpad, not the repo.
