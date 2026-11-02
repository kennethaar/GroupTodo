function storageReason(e) {
  const name = (e && e.name) || "";
  const msg  = trim(String((e && e.message) || ""));
  if (name === "NotAllowedError" || name === "SecurityError")
    return "the browser's permission to the folder has lapsed";
  if (name === "NotFoundError")
    return "the folder or file is not where it was";
  if (name === "NoModificationAllowedError")
    return "something else is holding the file open";
  if (name === "QuotaExceededError")
    return "there is no room left";
  if (/failed to fetch|networkerror|load failed|err_connection/i.test(msg))
    return "the server is not answering";
  return msg || name || "no reason given";
}
