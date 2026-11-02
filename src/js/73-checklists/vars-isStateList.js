/* ---------- task types: a list of stages ----------
   A list marked kind:: states is not steps to do but the steps ONE task goes
   through -- a purchase is Ordered, Awaiting delivery, Delivered; a book is To
   read, Reading, Done reading. Each line is a stage, and says in brackets
   which of the five states it counts as, so everything that already knows
   what waiting or done means -- Waiting for, the review, the reports -- keeps
   knowing:

       kind:: states
       - Ordered (waiting)
       - Awaiting delivery (waiting)
       - Delivered (done)

   Without brackets the first line counts as to do, the last as done and the
   ones between as doing. A task of that type keeps its ordinary state word,
   so the file still reads as a task anywhere, and says where it is with
       stage:: [[8/Purchase]] Awaiting delivery */
const isStateList = path => pageKind(path) === "checklist" && trim(getPage(path)?.props?.kind || "") === "states";
const stateLists = () => checklistPages().filter(isStateList);
