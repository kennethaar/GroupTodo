# Changelog

The version is `APP_VERSION` near the top of `grouptodo.html`, and it is shown
beside the name, top left. Every change that is pushed raises it: the last
number for a fix, the middle one for a feature, the first one for a change
that breaks existing vaults. Newest first.

## 1.2.0 - 2026-10-29

- Stakeholders on responsibilities (#158): `stakeholder::` on a
  responsibility's page, people or organisations, picked with + stakeholder.
  Send {name} an update then has a summary of each project under the
  responsibilities they follow: status, next action, done since they were last
  told, late and waiting. Sending stamps `told::` and logs the update under
  Updates sent on the responsibility's page. Their page says what they follow
  and how often they want to hear (`update_every::`, monthly unless set);
  when that has passed, a nudge, Waiting for and the weekly review say so.
  Notify on a finished project offers them too. An organisation stakeholder is
  not a client of the projects.

## 1.1.0 - 2026-10-29

- Send an update (#153): the check-in sheet the other way round, for your own
  tasks somebody is waiting to hear about. `/inform` on a line, Alt+U, the
  line menu, the side panel, or Send … an update on a person's or
  organisation's page. Each line goes with a status and a comment, in the mail
  or as a read-only sheet. Sent lines get `informed::`, a "Told …" line in
  their chat, and a changed status can go to the task. Waiting for shows
  "told Nd ago" beside "asked Nd ago". Wording in Settings → Inform note.

## 1.0.0 - 2026-10-29

- Version numbers: shown beside GroupToDo, top left.
- A regression battery: `node tests/run.mjs` (or double-click `tests/run.cmd`).
