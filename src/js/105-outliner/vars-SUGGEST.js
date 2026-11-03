/* ============================================================
   SUGGESTIONS AS YOU TYPE -- pages, names and dates
   The prefix in a link is the folder it lives in, so [[c/ can only mean a
   context and [[p/ can only mean a person. That is knowledge the app already
   has, and so are the names themselves: everybody in People, every
   organisation, every project, every context. Having to remember which letter
   goes with which folder, and then how you spelled the page last time, is the
   work a list on screen exists to take away.

   Five ways in, one list:
     [[        every page, the way it always worked
     @  #      contexts, projects
     a name    the start of any name you have used
     a date    tomorrow, friday, next week, in 3 days
   The key that takes a row is the one chosen in Settings > Writing.

   Nothing is written by the list itself. Taking a row inserts the same
   [[ref]] you could have typed, and the page behind it is created on blur by
   the same createLinkedPages the outliner already ran.
   ============================================================ */
let SUGGEST = null;          // {host, box, rows, i, at, end, mode, opts}
let SUGGEST_DISMISSED = "";  // the fragment Escape said no to, so it stays said
