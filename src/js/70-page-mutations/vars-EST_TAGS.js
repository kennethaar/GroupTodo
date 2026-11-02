/* ---------- how long a task takes ----------
   The dots of a paper list, one for each quarter of an hour. On disk it is a
   tag like any other -- "Ring the bank #15m", "Write the agenda #30m", "Draft
   the brief #45m" -- so it reads in any editor, searches as a word, and the
   tag board sorts by it for nothing. On screen it is the dots: one, two or
   three, in front of the words. #60m is an hour or more, a block that wants
   its own slot in the calendar rather than a gap between other things.

   You give a task its time by typing the dots: ". " ".. " "... " in front of
   the words, or pick the line (Esc) and press the full stop that many times. */
const EST_TAGS  = ["", "15m", "30m", "45m", "60m"];
const EST_MARK  = ["", "·", ":", "⋯", "∷"];
const EST_LABEL = ["", "under 15 min", "under 30 min", "under 45 min", "an hour or more"];
