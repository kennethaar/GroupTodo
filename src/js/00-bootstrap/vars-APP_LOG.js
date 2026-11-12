/* ---------- what happened, for when something goes wrong (#364) ----------
   Every message the app gave, and each folder and storage event, with the
   time. It lives in memory only, the last few hundred lines, and leaves the
   device only as a file you save: by itself when a folder stops answering,
   or with Save log. Then "it went back to browser storage" has a story. */
const APP_LOG = [], APP_LOG_MAX = 600;
