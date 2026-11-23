/* An online meeting's join link: Teams, Zoom, Google Meet or Webex (#480).
   An ordinary link in a description is not one. */
const MEET_LINK_RE = /https:\/\/(?:teams\.microsoft\.com|teams\.live\.com|[\w-]+\.zoom\.us|zoom\.us|meet\.google\.com|[\w-]+\.webex\.com)\/[^\s<>"]+/i;
