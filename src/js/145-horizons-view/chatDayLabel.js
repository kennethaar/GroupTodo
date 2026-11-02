function chatDayLabel(day) {
  if (day === todayISO()) return "Today";
  if (day === shiftISO(todayISO(), -1)) return "Yesterday";
  return humanDate(day);
}
