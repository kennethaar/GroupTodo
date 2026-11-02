/* What the bell on a pill says: null without a time, else whether a reminder
   will go off and when. */
function remindInfo(b) {
  const w = dueWhen(b);
  if (!w || !w.time) return null;
  const lead = remindLead(blockProp(b, "remind"));
  if (lead == null) return {off: true, title: "No reminder"};
  const at = hmMinutes(w.time) - lead;
  const hm = pad2(Math.floor(((at % 1440) + 1440) % 1440 / 60)) + ":" + pad2(((at % 60) + 60) % 60);
  return {off: false, title: "Reminder " + (lead ? leadWords(lead) + " before (" + hm + ")" : "at the time (" + w.time + ")")};
}
