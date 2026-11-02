/* ---------- the clock on a todo ----------
   Logseq's lines, in the task's :LOGBOOK: drawer, which is kept and written
   back as it came:
     CLOCK: [2026-10-23 Fri 09:02:11]--[2026-10-23 Fri 10:47:30] =>  01:45:19
   A clock with no end is the task still being done. It counts up to now on
   the day it started, and as nothing after that, the same as hours. */
const CLOCK_RE = /^CLOCK:\s*\[(\d{4}-\d{2}-\d{2})[^\]\d]*(\d{1,2}):(\d{2})(?::(\d{2}))?\](?:\s*--\s*\[(\d{4}-\d{2}-\d{2})[^\]\d]*(\d{1,2}):(\d{2})(?::(\d{2}))?\])?/;
const clockStamp = (d = new Date()) => isoOf(d) + " " + ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d.getDay()] + " " +
  pad2(d.getHours()) + ":" + pad2(d.getMinutes()) + ":" + pad2(d.getSeconds());
const logbookOf = b => (b.drawers || []).find(d => trim(d[0] || "").toUpperCase() === ":LOGBOOK:");
/* Passing through Doing on the way to Waiting is not doing it: a stretch
   shorter than this leaves no line behind. The chip shows at once, so the
   clock can be changed straight away. */
const CLOCK_GRACE_MS = 60000;
/* Some use Doing only to say what is in hand, and want no clock. Off, Doing
   starts none; a clock already running still stops when the task leaves it. */
const clockOnDoing = () => PREF.get("clock.doing", "1") !== "0";
