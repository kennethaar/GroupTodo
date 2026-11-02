/* hold:: open is on hold with no date: committed, but not now, and nobody
   knows when. It stays held until somebody takes it off. As a value it is the
   word "open", which sorts after every date, so "the later of two holds" and
   "still in the future" need no special case. */
const HOLD_OPEN = "open";
