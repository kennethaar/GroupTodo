/* ---------- back and forward ----------
   Installed to a home screen this app has no browser bar, and in a tab the
   browser's own arrows leave the app entirely: every screen here is one URL,
   so Back went to whatever site you were on before. The places you have been
   are therefore kept here, and the two arrows in the header walk them.

   A place is the handful of state fields a view is drawn from, plus the space
   it was in -- so coming back to a page in another vault switches vaults on
   the way, the same as clicking the link did. A line you focused on is part of
   the place, so Back walks out of it. */
const NAV_FIELDS = ["view", "sub", "pagePath", "context", "statusCode", "query", "searchFilter",
                    "graphFocus", "jz", "todayWho", "todayDay", "todayWeek", "org", "ctxFilter", "waitWho", "horizonArea", "helpTopic"];
let NAV_HIST = [], NAV_AT = -1, NAV_JUMPING = false;
