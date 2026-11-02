/* /run on a line: the line you are on is where the steps go, so there is no
   "Add to..." to answer. The lists come in the same groups as in Settings. A
   routine or checklist goes under the line by putMacroLine's rule -- the line
   itself when it is empty, else just below it -- and a project template makes
   its project as it always does, with the line linking to it. */
const RUN_GROUPS = [
  ["Routines", pth => isRoutine(pth) && !isProjectTemplate(pth)],
  ["Checklists", pth => !isRoutine(pth) && !isProjectTemplate(pth)],
  ["Project templates", pth => isProjectTemplate(pth)],
];
