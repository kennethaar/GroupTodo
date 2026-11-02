/* Waiting is always on somebody else, so a line made Waiting with nobody named
   comes back with the person row already open. */
let FLY_OPEN_AFTER = null;

/* ---------- meetings ----------
   A meeting is a line tagged #meeting. Its title is the line, attendees:: and
   time:: are its values, and its agenda is the lines under it. A meeting on
   a page that is not its day carries date:: as well. One that came in from a
   calendar also carries cal_uid:: and cal_feed::, so the next import updates
   it in place instead of adding it again. */
const MEETING_RE = /(^|\s)#meeting(?![\p{L}\p{N}_-])/iu;
const isMeeting = b => MEETING_RE.test(String(b?.title || ""));
const meetingTitle = b => trim(String(b.title || "").replace(MEETING_RE, " ").replace(/\s{2,}/g, " "));
