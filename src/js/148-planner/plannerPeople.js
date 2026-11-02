/* Planner assigns by account, so only people in the area with email:: on
   their page; an outsider's address would fail the whole card. */
function plannerPeople(r) {
  const emails = [], missing = [];
  for (const name of projectPeople(r)) {
    if (!inSpace(r.space, () => isMember(name))) continue;
    const mail = emailOf(name, r.space);
    if (looksLikeEmail(mail)) emails.push(mail.toLowerCase()); else missing.push(name);
  }
  return {emails: [...new Set(emails)].sort(), missing};
}
