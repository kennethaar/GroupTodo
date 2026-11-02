/* The weekly review is only "due" once a week of actually using the thing has
   passed. Day one should not open with a red chip about a review you could not
   possibly have done yet. */
function reviewBaseline() {
  const last = dateIn(getSetting("last_review"));
  if (last) return last;
  return dateIn(getSetting("started")) || todayISO();
}
