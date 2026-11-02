/* ---------- time on site ----------
   A visit is a line on the day page it happened on, tagged #timelog: who came,
   for which project, and the clock when they came and went.

     - #timelog [[p/Ola Nordmann]] [[1/Bathroom renovation]] tiles
       in:: 07:30
       out:: 15:45

   The clock is what is written, never the sum, so a day can be gone through
   with the times in hand. A line with in:: and no out:: is somebody still
   there. Away for a few hours and back again is two lines. hours:: 3.5 stands
   in for a visit whose clock nobody noted. /in writes one, /out closes one. */
const TIMELOG_RE = /(^|\s)#timelog(?![\p{L}\p{N}_-])/iu;
const isTimeLog = b => TIMELOG_RE.test(String(b?.title || ""));
