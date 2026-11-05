// The preset's name, the one custom time, or how many.
function meetRemindLabel(feed = null) {
  const leads = meetRemindLeads(feed), v = meetRemindValue(leads);
  const preset = MEET_REMIND_CHOICES.find(([x]) => x === v);
  if (preset) return preset[1];
  return leads.length === 1 ? meetLeadWords(leads[0], true) : leads.length + " reminders";
}
