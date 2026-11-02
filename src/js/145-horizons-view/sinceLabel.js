/* "just now", "2 hours ago", "yesterday", "3 days ago", "6 Oct". */
function sinceLabel(stamp) {
  const t = Date.parse(stamp || "");
  if (!t) return "";
  const mins = Math.floor((Date.now() - t) / 60000);
  if (mins < 2)    return "just now";
  if (mins < 60)   return mins + " min ago";
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)    return hrs + (hrs === 1 ? " hour ago" : " hours ago");
  const days = Math.floor(hrs / 24);
  if (days === 1)  return "yesterday";
  if (days < 7)    return days + " days ago";
  return humanDate(dateIn(stamp) || "");
}
