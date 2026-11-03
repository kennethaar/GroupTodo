/* ---------- Book › Timeline (#250) ----------
   when:: read as a point in the story: a date (1987, 1987-06, 1987-06-14),
   or a day (Day 3, Dag 3, or just 3), and a time of day after a comma
   (Day 3, evening). Dates and days do not mix: the kind most scenes use is
   the book's clock, and a scene told in the other is listed with those that
   have no time. Anything else ("two weeks later") is not guessed at. */
const DAY_PARTS = [[/\b(dawn|morning|morgen|morgon|daggry)\b/i, .2], [/\b(noon|midday|middag)\b/i, .5],
  [/\b(afternoon|ettermiddag|eftermiddag)\b/i, .6], [/\b(evening|kveld|kväll|aften)\b/i, .8], [/\b(night|natt|nat)\b/i, .9]];
