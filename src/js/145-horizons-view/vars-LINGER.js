

/* A row in four corners: the circle and the row's one menu top left, the
   title beside them, what the task is (context, project, people) bottom left,
   and when and how it stands (date, age, urgency, messages) bottom right.
   The circle walks TODO -> DOING -> WAIT -> DONE, and the state is written
   under it. TODO is what every open task is, so it takes no word. */
/* Waiting moves a task off Next, onto Waiting for. Gone the moment you tap,
   it looks lost, so the row stays a few seconds and counts down -- time to see
   where it went, take it back, or tap on to done. */
const LINGER = new Map(), LINGER_MS = 10000;
let LINGER_TICK = null;
const lingerSays = until => "Moving to Waiting for in " + Math.max(0, Math.ceil((until - Date.now()) / 1000));
