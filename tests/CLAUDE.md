# Writing test fixtures

- Set dates with `setDue(block, date)`. `SCHEDULED:` lines in fixture text are
  not parsed as dates.
- A task with an open child is not a leaf action. Keep leaf steps childless.
- A page's file name is its title as written (`slugify` keeps case and
  spaces), so `[[Kitchen renovation]]` finds `Kitchen renovation.md`, not
  `kitchen-renovation.md`.
- Edit `tests/battery.js` with Edit, not with ad hoc Node rewrite scripts.
