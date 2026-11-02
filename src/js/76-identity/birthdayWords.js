function birthdayWords(v) {
  const b = parseBirthday(v);
  if (!b) return v;
  const date = new Date(2000, b.month - 1, b.day).toLocaleDateString(undefined, {day: "numeric", month: "long"});
  return date + (b.year ? " " + b.year : "") + " · " + birthdayWhen(nextBirthday(b));
}
