const ganttRows = () => memo("ganttRows", () => {
  const groups = acrossSpaces(ganttRowsHere);
  // acrossSpaces tags the groups; the tasks inside them need the same stamp,
  // or a click would edit the row through the wrong space's backend.
  for (const g of groups) for (const t of g.tasks) t.space = g.space;
  return groups;
});

const GANTT_SPANS = [["3", "3 months", 3], ["6", "6 months", 6], ["12", "A year", 12], ["fit", "Fit", 0]];

/* The window the chart is currently drawn in. A drag has to turn pixels back
   into days, and it is the same arithmetic the bars were placed with, so it is
   kept rather than recomputed from the DOM. */
let GWIN = null;
