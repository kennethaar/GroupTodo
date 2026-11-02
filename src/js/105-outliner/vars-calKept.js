/* Write a calendar's meetings into an area's day pages. The calendar decides
   the title, time and attendees; what you write under a meeting stays. One
   that has left the calendar goes too, unless something was written under it. */
// Something was written under the meeting: a line with steps under it, or a task.
const calKept = b => (b.children || []).some(c => (c.children || []).length || c.state);
