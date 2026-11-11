/* A Teams chat with these people, the message typed in (#354). On a PC the
   msteams: link goes straight to the Teams app, which finds people outside
   the organisation; the https link goes through the web launcher, which only
   searches our own directory and opens an empty chat for them. A phone keeps
   the https link, which its Teams app takes over. */
function teamsChatUrl(users, message, phone = onPhone()) {
  const who = [].concat(users).map(u => encodeURIComponent(bareAddress(u)).replace(/%40/g, "@")).join(",");
  return (phone ? "https://teams.microsoft.com" : "msteams:") + "/l/chat/0/0?users=" + who +
    (message ? "&message=" + encodeURIComponent(message) : "");
}
