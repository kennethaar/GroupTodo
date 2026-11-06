/* ---------- icons shared across the app ----------
   Issue #300 moved the mobile line toolbar off emoji and onto monochrome SVG
   paths for svgIcon() (vars-svgIcon.js); issue #301 does the same for every
   other place that still used an emoji or Unicode symbol as a control's icon
   -- the sidebar, pins, close buttons, checkmarks, warnings and the rest.
   Every path here is 24x24, one stroke weight, drawn for currentColor; a few
   (play, stop, the sparkle, the filled star) fill instead of stroke, and say
   so inline. Rows that share a concept with vars-EDIT_BAR.js or
   vars-FLY_ICON.js repeat that file's path on purpose, so the same thing
   draws the same glyph everywhere -- those two files load after this one, so
   this file cannot reference them the other way round. */
const ICON_PERSON    = '<circle cx="12" cy="7" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/>';
const ICON_ORG        = '<path d="M4 21V8l8-5 8 5v13"/><path d="M9 21v-6h6v6"/><path d="M9 11h.01M9 15h.01M15 11h.01M15 15h.01"/>';
const ICON_PAGE        = '<path d="M7 3h7l4 4v14H7z"/><path d="M14 3v4h4"/><path d="M9 13h6M9 17h6"/>';
const ICON_TELESCOPE  = '<path d="M4 15l13-6 1.5 3-13 6z"/><circle cx="7.5" cy="13" r="1.3"/><path d="M8 18l-1.5 3M17 12l2 2"/>';
const ICON_FLAG        = '<path d="M6 3v18"/><path d="M6 4h11l-3 4 3 4H6"/>';
const ICON_BOLT        = '<path d="M13 2L4 14h6l-1 8 9-12h-6z"/>';
const ICON_SUN          = '<circle cx="12" cy="12" r="4.5"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/>';
const ICON_HOURGLASS  = '<path d="M6 3h12M6 21h12M6 3c0 6 5 7.5 6 9 1-1.5 6-3 6-9M6 21c0-6 5-7.5 6-9 1 1.5 6 3 6 9"/>';
const ICON_CHAT        = '<path d="M4 5h16v11H9l-4 4V5z"/><path d="M8 9h8M8 12.5h5"/>';
const ICON_REPEAT      = '<path d="M4 12a8 8 0 0 1 14-5.3M20 4v4h-4"/><path d="M20 12a8 8 0 0 1-14 5.3M4 20v-4h4"/>';
const ICON_PENCIL      = '<path d="M4 20l1-4.5L16 4.5l3.5 3.5L8.5 19z"/><path d="M14 6.5l3.5 3.5"/>';
const ICON_GEAR        = '<circle cx="12" cy="12" r="3"/><path d="M12 3v2.5M12 18.5V21M4.2 7.5l2.2 1.3M17.6 15.2l2.2 1.3M3 12h2.5M18.5 12H21M4.2 16.5l2.2-1.3M17.6 8.8l2.2-1.3M7.5 4.2l1.3 2.2M15.2 17.6l1.3 2.2M7.5 19.8l1.3-2.2M15.2 6.4l1.3-2.2"/>';
const ICON_TRENDUP    = '<path d="M4 17l6-6 4 4 7-8"/><path d="M15 6h6v6"/>';
const ICON_STOPWATCH  = '<circle cx="12" cy="13" r="8"/><path d="M12 13V8M9 3h6M12 3v2"/>';
const ICON_PIN          = '<path d="M9 4h6v4l3 3v2h-6v6l-1 1-1-1v-6H4v-2l3-3z"/>';
const ICON_LOCATION    = '<path d="M12 2a6 6 0 0 0-6 6c0 4.5 6 12 6 12s6-7.5 6-12a6 6 0 0 0-6-6z"/><circle cx="12" cy="8" r="2"/>';
const ICON_SCISSORS    = '<circle cx="6" cy="6" r="2.2"/><circle cx="6" cy="18" r="2.2"/><path d="M20 4L7.5 16.5M20 20L7.5 7.5"/>';
const ICON_CLOSE        = '<path d="M5 5l14 14M19 5L5 19"/>';
const ICON_CHECK        = '<path d="M4 12l6 6L20 6"/>';
const ICON_WARN        = '<path d="M12 3l9 16H3z"/><path d="M12 10v4M12 17h.01"/>';
const ICON_MAIL        = '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M4 7l8 6 8-6"/>';
const ICON_CARET        = '<path d="M5 9l7 7 7-7"/>';
const ICON_CHEVRON_UP    = '<path d="M5 15l7-7 7 7"/>';
const ICON_CHEVRON_LEFT  = '<path d="M15 5l-7 7 7 7"/>';
const ICON_CHEVRON_RIGHT = '<path d="M9 5l7 7-7 7"/>';
const ICON_ARROW_UP      = '<path d="M12 19V5M5 11l7-7 7 7"/>';
const ICON_ARROW_DOWN    = '<path d="M12 5v14M5 13l7 7 7-7"/>';
const ICON_ARROW_RIGHT  = '<path d="M4 12h14M13 6l6 6-6 6"/>';
const ICON_PLAY          = '<path d="M6 4l15 8-15 8z" fill="currentColor" stroke="none"/>';
const ICON_STOP          = '<rect x="5" y="5" width="14" height="14" rx="2" fill="currentColor" stroke="none"/>';
const ICON_CAKE        = '<path d="M4 21v-7a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v7z"/><path d="M4 17h16"/><path d="M8 11V8M12 11V7M16 11V8"/><path d="M12 3.5a1 1 0 1 0 0 2 1 1 0 1 0 0-2"/>';
const ICON_TROPHY      = '<path d="M7 4h10v6a5 5 0 0 1-10 0z"/><path d="M7 6H4v2a3 3 0 0 0 3 3M17 6h3v2a3 3 0 0 1-3 3"/><path d="M12 15v3M8 21h8M9 18h6"/>';
const ICON_SPARKLE      = '<path d="M12 3l1.8 6.2L20 11l-6.2 1.8L12 19l-1.8-6.2L4 11l6.2-1.8z"/>';
const ICON_CONFETTI    = '<path d="M4 20l6-14M9 20l4-11M14 20l3-8"/><circle cx="18" cy="5" r="1.2" fill="currentColor" stroke="none"/><circle cx="14" cy="4" r="1" fill="currentColor" stroke="none"/><circle cx="20" cy="9" r="1" fill="currentColor" stroke="none"/>';
const ICON_LIGHTBULB  = '<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3 11.2V16h6v-1.8A6 6 0 0 0 12 3z"/>';
const ICON_BUG          = '<circle cx="12" cy="13" r="5"/><path d="M9 9l-2-2M15 9l2-2M7 13H3M21 13h-4M9 18l-2 2M15 18l2 2M12 8V5"/>';
const ICON_STAR        = '<path d="M12 3l2.6 5.6 6.1.6-4.6 4.1 1.3 6-5.4-3.2-5.4 3.2 1.3-6-4.6-4.1 6.1-.6z"/>';
const ICON_STAR_FILL  = '<path d="M12 3l2.6 5.6 6.1.6-4.6 4.1 1.3 6-5.4-3.2-5.4 3.2 1.3-6-4.6-4.1 6.1-.6z" fill="currentColor" stroke="none"/>';
const ICON_DATE        = '<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M8 3v4M16 3v4"/>';
const ICON_CLOCK        = '<circle cx="12" cy="12" r="8.5"/><path d="M12 7v5l3.5 2"/>';
const ICON_MEETING      = '<circle cx="9" cy="8" r="3.3"/><path d="M3.5 20v-1.5A6 6 0 0 1 9 13"/><circle cx="16.3" cy="9" r="3"/><path d="M12.4 20v-1.2A5.3 5.3 0 0 1 16.3 13.6"/>';
const ICON_CHAIN        = '<path d="M9 15l6-6"/><path d="M8 11l-2 2a3 3 0 0 0 4 4l2-2M16 13l2-2a3 3 0 0 0-4-4l-2 2"/>';
