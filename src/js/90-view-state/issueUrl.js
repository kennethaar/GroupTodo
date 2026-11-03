/* ---------- feedback ----------
   Ideas and bugs go to GitHub issues, with the version and browser filled in,
   so a report says where it came from without anyone having to ask. */
function issueUrl(kind) {
  const about = "\n\n---\nGroupToDo v" + APP_VERSION + " · " + navigator.userAgent;
  const [title, body] = kind === "bug"
    ? ["Bug: ", "What happened?\n\n\nWhat did you expect?\n\n\nHow can we see it too?\n1. " + about]
    : ["Idea: ", "What would you like to do?\n\n\nWhy would it help you?\n" + about];
  return REPO_URL + "/issues/new?title=" + encodeURIComponent(title) + "&body=" + encodeURIComponent(body);
}
