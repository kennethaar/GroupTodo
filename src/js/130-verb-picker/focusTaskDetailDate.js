/* A few places send you here to give a task a day -- the "book a slot" chip,
   changing a hold's date -- rather than make you find the Scheduled pill
   yourself. If it is still a collapsed "+" pill, open it first. */
function focusTaskDetailDate(sheet) {
  const pill = [...sheet.querySelectorAll(".fpill")].find(x => /^\+ (Scheduled|Follow up|Hold until)/.test(x.textContent));
  if (pill) { pill.click(); return; }
  const input = sheet.querySelector(".dt input[type=date]");
  if (input) { input.scrollIntoView({block: "center"}); input.focus(); }
}
