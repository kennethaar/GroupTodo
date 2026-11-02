/* The time after a date property's day: "[[2026-10-24]] 14:00" -> "14:00". */
const timeIn = s => {
  const m = /(?:^|[\s\]])(\d{1,2}):(\d{2})(?![\d:])/.exec(s || "");
  return m && +m[1] < 24 && +m[2] < 60 ? pad2(+m[1]) + ":" + pad2(+m[2]) : null;
};
const whenValue = (day, time) => "[[" + day + "]]" + (time ? " " + time : "");
