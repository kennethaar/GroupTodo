/* Open a Teams chat with the message ready. Teams sometimes drops a message
   typed in by the link (a long one, or when it has to start first), so it is
   on the clipboard too, for Ctrl+V (#354). */
function openTeamsChat(users, message) {
  if (message) try { navigator.clipboard.writeText(message).catch(() => {}); } catch (_) {}
  openAppUrl(teamsChatUrl(users, message));
}
