function coachMark(step) {
  if (!coachOn()) return;
  PREF.set("coach." + step, "1");
}
