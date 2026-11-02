/* How connected each person, organisation and responsibility is to THIS
   project, as "p/name", "o/name", "a/name" (lower case) -> a score:
     5  named on the project page: its fields, its lines, who its tasks are for
     4  a person's or organisation's page that links to the project
     3  named in a line elsewhere that links to the project (a day page's notes)
     2  one step on: the people of its organisations, the organisations of its people
     1  on another project with the same responsibility
   So the box offers the ones this project is about first, not the alphabet. */
const solRef = l => trim(String(l).split("][")[0]).replace(/\.md$/i, "").toLowerCase();
const SOL_REF_RE = /^[poa]\//;
