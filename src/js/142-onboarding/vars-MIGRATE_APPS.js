/* Coming from another app (#458): each app the importer reads, and the steps
   from its files to a GroupToDo area. The importer is a page of its own,
   GroupToDo-Importer.html, next to this one. Shown on the first Journal
   while PREF migrate.card is "1": set when you start your own, "0" once
   closed. */
const MIGRATE_IMPORTER = "GroupToDo-Importer.html";
const MIGRATE_FOLDER_STEPS = [
  "Download the importer below, and open it in Chrome or Edge.",
  "Choose an empty folder, then Import to new folder. Your old files are not changed.",
  "Back here, add that folder as a new area.",
];
const MIGRATE_APPS = [
  ["Obsidian", ["In the importer, Choose vault or export folder: pick your Obsidian vault folder."]],
  ["Dynalist", ["In Dynalist, export your documents as OPML files into one folder.",
    "In the importer, Choose vault or export folder: pick that folder."]],
  ["Logseq", ["In the importer, Choose vault or export folder: pick your Logseq folder, the one with pages and journals in it."]],
  ["WorkFlowy", ["In WorkFlowy, export all as OPML into a folder of its own.",
    "In the importer, Choose vault or export folder: pick that folder."]],
];
