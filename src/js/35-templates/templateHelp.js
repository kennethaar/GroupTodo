function templateHelp() {
  return el(
    "details",
    {class: "section", style: "padding:12px;border:1px solid var(--line);border-radius:8px"},
    el("summary", {style: "cursor:pointer;font-weight:600"}, "Template help: fields, dates and automation"),
    el(
      "p",
      {},
      "This file defines new items and adds missing fields to existing items. Existing values and template files are not overwritten. Fields use name:: value. Blank fields stay blank. Existing values are preserved unless a rule says ; overwrite.",
    ),
    el(
      "pre",
      {style: "white-space:pre-wrap"},
      "created:: %today%\ncreated_at:: %now%\ndue:: %today+7d%\nowner:: %user%\n\n- @on status=DOING -> started=%today%\n- @on status=DONE -> completed=%today%\n- @on status!=DONE -> completed=%empty% ; overwrite\n- @on review -> reviewed=%today% ; overwrite",
    ),
    el(
      "p",
      {},
      "Placeholders: %today% local date; %now% UTC timestamp; %today+7d% / %today-1d% relative dates; %title% item title; %user% configured user; %empty% clears a field with ; overwrite. Initial values run once. Rules run on a status transition or an explicit review, never just when opening a page.",
    ),
    el(
      "p",
      {},
      "Projects use their folder name, for example 8/1.md. Tasks use 8/todo.md. Other types: p person, o organisation, c context, z note, a responsibility, g goal, k checklist, page generic, journals journal. Relation choices retain ^ for up and _ for down. Use feature_repeat_prompt:: true to offer the next recurring task, and feature_completion_prompt:: true to check project completion when closing a task. Set false to disable. Template updates add missing fields and new rules to existing items. Existing values, including blank fields, are preserved. Opening a page does not rerun status or review rules. Existing notes and child nodes are not duplicated.",
    ),
  );
}
