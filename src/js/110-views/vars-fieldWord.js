const fieldWord = f => f.label.replace(/\?$/, "").toLowerCase();

/* As lines, in the projects list: one per field, an icon before it (the
   sidebar's own for organisations and next actions), and a
   field answered with nothing (no deadline, nothing first) is not said. */
const FIELD_ICON = {orgs: ICON.orgs, next: ICON.next, outcome: "✓", deadline: "📅", after: "⛓"};
