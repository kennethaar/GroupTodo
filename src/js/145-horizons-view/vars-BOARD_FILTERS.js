/* ---------- board filters ----------
   The columns answer "what state is this in". These answer the other two
   questions a board gets asked: on the task board, which of these are filed
   under a project and which are still loose, and which have a context to do
   them in; on the project board, which projects have anything to do in them
   at all. Both lists of each pair are worth having -- the tasks with no
   context are the ones to clarify, the ones with a context are the ones to
   get on with -- so each pair is a pair of checkboxes rather than a choice.

   The same shape as the state filters, and for the same reasons: both on is
   the whole board, so the filters cost nothing until you use them; a pair
   whose answer is unanimous is not drawn, because a question with one answer
   is not a question; and turning off the last one on would leave an empty
   board, so it turns the other one back on instead. */
const BOARD_FILTERS = {
  tasks: [
    {key: "proj", yes: "In a project", no: "Loose",         test: a => !!a.project},
    {key: "ctx",  yes: "Has a context", no: "No context",   test: a => !!a.context},
  ],
  projects: [
    {key: "todos", yes: "With tasks", no: "Nothing to do",  test: r => projOpenCount(r) > 0},
  ],
};
