/* #450 Weekly review in the sidebar: once the review is due, or more than 30
   actions wait to be sorted. Once shown it stays until a review is marked
   done, though a count drops by itself: an item that vanishes while you use
   it makes the sidebar hard to predict. review.nav holds the last_review it
   was shown for; REVIEW_NAV.leaving keeps it for its goodbye (renderNav). */
function reviewInNav() {
  const at = "at:" + (getSetting("last_review") || "");
  if (reviewDue() || actToSort() > 30) {
    if (PREF.get("review.nav", "") !== at) PREF.set("review.nav", at);
    return true;
  }
  return PREF.get("review.nav", "") === at || REVIEW_NAV.leaving;
}
