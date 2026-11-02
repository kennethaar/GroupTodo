/* Waiting is always waiting on somebody, so moving a card there asks who,
   and writes it as waiting_for:: on the project page. */
/* Several projects dropped on Waiting for at once are asked about one after
   another, each when the one before is answered or skipped. */
const WAIT_ASKS = [];
