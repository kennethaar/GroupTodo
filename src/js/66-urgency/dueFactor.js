function dueFactor(day) {
  const late = dateDiffDays(day, todayISO());          // days past it
  if (late == null) return 0;
  if (late >= 7) return 1;
  if (late >= -14) return (late + 14) * 0.8 / 21 + 0.2;
  return 0.2;
}
