const allThreads = () => memo("allThreads", () => acrossSpaces(allThreadsHere)
  .sort((a, b) => String(b.at).localeCompare(String(a.at))));

const CHAT_FILTERS = [["all", "All"], ["unread", "Unread"], ["flagged", "Flagged"]];
