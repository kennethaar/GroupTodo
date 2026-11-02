const planEmailText = path => {
  const m = emailPageMail(path);
  return ["Subject: " + m.subject, m.name ? "From: " + m.name : null, m.sent ? "Date: " + m.sent : null,
    m.to ? "To: " + m.to : null, "", ...m.body].filter(l => l != null).join("\n");
};
