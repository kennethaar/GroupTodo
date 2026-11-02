/* max:: on the same page, any whole number of minutes; 60 if it says nothing. */
function timerMax() {
  const n = Math.round(parseFloat(String(getPage(TIMER_PATH)?.props?.max ?? "").replace(",", ".")));
  return n >= 1 ? n : 60;
}
