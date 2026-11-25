/* The day Catch up looks back to (#516), from the area's Look back choice:
   "last" (since the last review, else 7 days), a number of days, or
   "date:YYYY-MM-DD". The choice is remembered per area. */
function catchUpBack() {
  const last = dateIn(getSetting("last_review"));
  const v = PREF.get("catchup.back:" + (V.space || ""), "") || (last ? "last" : "7");
  return v === "last" && !last ? "7" : v;
}
function catchUpSince(back = catchUpBack()) {
  const ago = d => new Date(Date.now() - d * 864e5).toISOString().slice(0, 10);
  if (back === "last") return dateIn(getSetting("last_review")) || ago(7);
  if (/^date:\d{4}-\d{2}-\d{2}$/.test(back)) return back.slice(5);
  return ago(+back || 7);
}
