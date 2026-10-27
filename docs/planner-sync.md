# Projects in Microsoft Planner (experimental)

Some people you work with keep their work in Planner: one card per project,
sorted into buckets by key account. Instead of moving them to GroupToDo, an
area can send its projects to their plan. They keep working the way they do;
you keep the markdown.

**Experimental, phase 1: GroupToDo → Planner only.** What people change in
Planner is not read back yet, and the next sync puts GroupToDo's version back
on the card. The one thing that comes back is which card belongs to which
project.

## What ends up where

| Planner | From GroupToDo |
|---|---|
| Plan | one area |
| Bucket | the project's client: `org::` on the project, else on its area. Suppliers (`role:: supplier`) are left out. With several clients, the one with the largest `client_split::` share, else the first one named. *No account* when there is none. |
| Card | one project: active, waiting for and someday. Completed and cancelled projects only once they have a card, so it gets ticked off. Old finished projects are left out. |
| Title | the project's name |
| Progress | Active and Waiting for → In progress, Someday → Not started, Completed and Cancelled → Completed |
| Start / Due | the earliest `SCHEDULED::` in the project / its `deadline::`, else the last open `DEADLINE::` |
| Assigned to | people in `with::` who are members of the area and have `email::` on their page |
| Checklist | open next actions, most urgent first, then steps done in the last 14 days, ticked. Up to 20, Planner's limit. |
| Notes | outcome, status, what it is waiting for, what was done lately. Below a divider, so anything written above it in Planner stays. |

## How it travels

GroupToDo cannot talk to Planner directly: it is not allowed to connect
anywhere but your own computer. The area's folder carries it, so the folder
has to be one that OneDrive or SharePoint syncs (a Teams channel's Files,
synced to File Explorer, works).

```
GroupToDo ──writes──▶ planner/outbox.json ──▶ Power Automate flow ──▶ Planner
GroupToDo ◀──reads─── planner/state.json  ◀──writes── flow
```

1. **Vault & sync → Microsoft Planner → Send this area's projects to Planner.**
   This needs Chrome or Edge with the area in a folder on this computer. The
   projects are sent from this one computer (`planner_by::` in the area's
   `pages/GTD.md`), so two people never write the outbox at once. Someone else
   can take it over with *Send from this computer instead*.
2. Every two minutes, while the app is open, it writes the cards that changed
   to `planner/outbox.json`. It waits until the flow has answered before it
   writes the next one. If the flow has not answered after 30 minutes, it sends
   again.
3. The flow puts the cards in the plan and writes `planner/state.json`: the
   number of the outbox it handled, and the IDs of any new cards.
4. GroupToDo writes each new card's ID onto its project page as
   `planner_id:: …`. The ID moves with the page when the project is renamed or
   changes shelf. It is not shown among the page's values.

`planner/sent.json` is GroupToDo's own note of what each card was last given,
so it sends only what changed. Delete it to send every card again.

## Setting up the flow

Once per area, by someone with Power Automate and access to the plan. The
plan has to belong to a Microsoft 365 group or Team.

Turn the sync on in GroupToDo first, so `planner/state.json` exists. Then, in
[make.powerautomate.com](https://make.powerautomate.com), make an
**Automated cloud flow**. The step names below are used in the expressions;
rename your steps to match, or change the expressions.

1. **Trigger:** *When a file is created or modified (properties only)*, from
   OneDrive for Business or SharePoint, depending on where the folder lives.
   Point it at the area's `planner` folder. Under *Settings → Trigger
   conditions*, add
   `@equals(triggerOutputs()?['body/{Name}'], 'outbox.json')`
   so the flow does not also fire when it writes `state.json`. Don't want a
   trigger? Use a *Recurrence* every 5 minutes instead.
2. **Get file content using path** → `planner/outbox.json`. Name it `Get_outbox`.
3. **Compose**, named `Outbox`:
   `json(base64ToString(body('Get_outbox')?['$content']))`.
   If your connector hands back plain text instead, use `json(body('Get_outbox'))`.
4. **Get file content using path** → `planner/state.json` (`Get_state`), and
   **Compose** `State` the same way.
5. **Condition:** `outputs('Outbox')?['seq']` is equal to
   `outputs('State')?['applied']`. In the **True** branch, add *Terminate*
   (Succeeded): this outbox has already been handled, and handling it twice
   would create cards twice.
6. **List buckets** (Planner; your Group and Plan). Then **Initialize
   variable** `buckets`, type Array, value `body('List_buckets')?['value']`.
   **Initialize variable** `created`, Array, `[]`, and `taskId`, String.
7. **Apply to each** `outputs('Outbox')?['buckets']`, named `Each_bucket`.
   Under *Settings*, set concurrency to 1.
   - **Filter array** `variables('buckets')` where `item()?['name']` is equal to `items('Each_bucket')`.
   - **Condition:** `length(body('Filter_array'))` is equal to 0 → **Create a
     bucket** with name `items('Each_bucket')`, then **Append to array variable**
     `buckets`: `{"name": items('Each_bucket'), "id": body('Create_a_bucket')?['id']}`.
8. **Apply to each** `outputs('Outbox')?['tasks']`, named `Each_task`,
   concurrency 1:
   - **Filter array** `variables('buckets')` where `item()?['name']` is equal to
     `items('Each_task')?['bucket']`. Name it `Bucket`. The bucket's ID is
     `first(body('Bucket'))?['id']`.
   - **Condition:** `items('Each_task')?['op']` is equal to `create`.
     - **True:** **Create a task**: Title `items('Each_task')?['title']`, Bucket
       Id as above, Assigned User Ids `join(items('Each_task')?['assignees'], ';')`.
       Then **Set variable** `taskId` to `body('Create_a_task')?['id']`, and
       **Append to array variable** `created`:
       `{"key": items('Each_task')?['key'], "id": body('Create_a_task')?['id']}`.
     - **False:** **Set variable** `taskId` to `items('Each_task')?['id']`.
   - **Update a task**: Task Id `variables('taskId')`; Title; Bucket Id; Start
     Date Time `items('Each_task')?['start']`; Due Date Time `items('Each_task')?['due']`;
     Progress or Percent complete from `progress` (`notStarted`, `inProgress`,
     `completed`) or `percentComplete` (0, 50, 100), whichever your action
     shows. If it has fields for assigning and unassigning, use `assignees` and
     `assigneesRemove`.
   - **Get task details** (`variables('taskId')`).
   - **Update task details**: Task Id `variables('taskId')`; Description
     ```
     concat(trim(first(split(coalesce(body('Get_task_details')?['description'], ''), outputs('Outbox')?['notesDivider']))), decodeUriComponent('%0A%0A'), outputs('Outbox')?['notesDivider'], decodeUriComponent('%0A'), items('Each_task')?['notes'])
     ```
     This keeps what people wrote above the divider and replaces the rest.
     For the checklist, switch the field to array input and give it
     `items('Each_task')?['checklist']`. Its items already carry `id`, `title`
     and `isChecked`.
9. **Compose** `NewState`:
   `{"applied": outputs('Outbox')?['seq'], "written": utcNow(), "created": variables('created')}`.
   Then **Update file** `planner/state.json` with content `string(outputs('NewState'))`.

Test it by pressing **Send now** in Vault & sync. After the flow's next run,
GroupToDo's line there should read *Planner is up to date*.

If the flow fails, put `"error": "what went wrong"` in `state.json`, by hand
or from a *Run after: has failed* branch. GroupToDo shows it in Vault & sync.

## The files

`planner/outbox.json`, written by GroupToDo:

```json
{
  "format": "grouptodo-planner/1",
  "experimental": true,
  "seq": 7,
  "written": "2026-10-27T10:02:00.000Z",
  "area": "Work",
  "by": "Kari Nord",
  "notesDivider": "---- from GroupToDo, replaced on every sync ----",
  "buckets": ["Acme", "Beta", "No account"],
  "tasks": [
    {
      "op": "create",
      "key": "pages/1/Acme website.md",
      "title": "Acme website",
      "bucket": "Acme",
      "progress": "inProgress",
      "percentComplete": 50,
      "start": "2026-11-02",
      "due": "2026-12-01",
      "assignees": ["kari@firma.no"],
      "assigneesRemove": [],
      "notes": "Outcome: New site live\nStatus: Active\n…",
      "checklist": [{"id": "be077712-eb6f-4dd3-a4be-f708d7274739", "title": "Draft the offer", "isChecked": false}],
      "checklistRemove": [],
      "hash": "a5f7a8a2"
    }
  ]
}
```

- `op` is `create` for a project with no card yet, or `update` with the card's `id`.
- `key` is the project's file. It only matters for `create`: the flow hands it back with the new ID.
- `buckets` lists every bucket the plan needs, not only the ones for cards in this outbox.
- `checklistRemove` and `assigneesRemove` are items and people the card had last time and no longer has.
- `hash` is GroupToDo's own. The flow can ignore it.

`planner/state.json`, written by the flow (GroupToDo writes `{"applied": 0}` once to start it):

```json
{"applied": 7, "written": "2026-10-27T10:04:11Z", "created": [{"key": "pages/1/Acme website.md", "id": "xYz…"}]}
```

## Not yet

- Changes made in Planner coming back: a ticked card or checklist item, a new
  card, a card moved to another bucket.
- Labels, and Planner Premium's dependencies (`depends_on::`).
- An area kept on the sync server (`serve.py`) or only in the browser. Phase 1
  reads and writes a real folder on this computer.

Ideas and problems: [issue #91](https://github.com/kennethaar/GroupTodo/issues/91).
