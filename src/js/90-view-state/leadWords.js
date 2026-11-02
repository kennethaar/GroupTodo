// 90 -> "1 h 30 min", 1440 -> "1 day".
function leadWords(n) {
  if (!n) return "at the time";
  if (n % 1440 === 0) return n / 1440 + (n === 1440 ? " day" : " days");
  return [n >= 60 ? Math.floor(n / 60) + " h" : "", n % 60 ? n % 60 + " min" : ""].filter(Boolean).join(" ");
}
