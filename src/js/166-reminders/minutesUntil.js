/* In the timezone the app is set to, like todayISO(), so a reminder and the
   day it sits on can never disagree about which day it is. */
function minutesUntil(day, time) {
  const d = dateDiffDays(todayISO(), day);
  return d == null ? null : d * 1440 + hmMinutes(time) - hmMinutes(nowHM());
}
