/* ---------- icons for the line's own menu (flyRows.js) ----------
   The desktop/long-press line menu shows the same actions the mobile foot
   toolbar (vars-EDIT_BAR.js) groups behind Type/Tag/Media, plus several it
   doesn't: Due, Repeat, Ask/Send an update, Meeting, Insert tracker, Refile,
   Plan with an AI, Copy as embed, Open in the side panel. Rows that share a
   concept with EDIT_BAR reuse its EB_* path, so the two menus draw the same
   glyph for the same thing. Everything here is a monochrome SVG path for
   svgIcon() (vars-svgIcon.js), 24x24, drawn at one stroke weight. */
const FLY_STATE   = '<circle cx="12" cy="12" r="8.5"/><path d="M12 3.5a8.5 8.5 0 0 1 0 17z" fill="currentColor" stroke="none"/>';
const FLY_TYPE    = '<path d="M4 7h16M4 12h16M4 17h16"/>';
const FLY_DATE    = '<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M8 3v4M16 3v4"/>';
const FLY_MAIL    = '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M4 7l8 6 8-6"/>';
const FLY_REPEAT  = '<path d="M4 12a8 8 0 0 1 14-5.3M20 4v4h-4"/><path d="M20 12a8 8 0 0 1-14 5.3M4 20v-4h4"/>';
const FLY_MEETING = '<circle cx="9" cy="8" r="3.3"/><path d="M3.5 20v-1.5A6 6 0 0 1 9 13"/><circle cx="16.3" cy="9" r="3"/><path d="M12.4 20v-1.2A5.3 5.3 0 0 1 16.3 13.6"/>';
const FLY_TRACKER = '<path d="M7 17L17 7M9 7h8v8"/>';
const FLY_REFILE  = '<path d="M5 5v14M9 12h11M16 7l4 5-4 5"/>';
const FLY_PLAN    = '<path d="M12 3l1.8 6.2L20 11l-6.2 1.8L12 19l-1.8-6.2L4 11l6.2-1.8z"/>';
const FLY_EMBED   = '<rect x="3" y="10" width="11" height="11" rx="2"/><rect x="10" y="3" width="11" height="11" rx="2"/>';
const FLY_TRASH   = '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>';
const FLY_PANEL   = '<path d="M4 15v5h5M20 9V4h-5M4 4l6 6M20 20l-6-6"/>';
