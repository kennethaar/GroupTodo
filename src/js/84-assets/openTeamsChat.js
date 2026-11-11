// Open a Teams chat with the message ready. The app link leaves the page as it is.
function openTeamsChat(users, message) {
  const url = teamsChatUrl(users, message);
  if (url.startsWith("msteams:")) location.href = url;
  else window.open(url, "_blank", "noopener");
}
