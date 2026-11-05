function meetRemindLabel() {
  const lead = meetRemindLead();
  return (MEET_REMIND_CHOICES.find(([v]) => v === (lead == null ? "off" : lead === 0 ? "start" : String(lead))) || [])[1] || "Off";
}
