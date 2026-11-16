/* A video or post link just pasted, and the title its site gave for it (#404).
   It shows as a quiet Use title "…" at the end of the line until it is used,
   waved away, or another link is pasted. */
const LINK_TITLE = {id: null, url: "", label: "", seq: 0, timer: 0};
const LINK_TITLE_WAIT = 30000;
/* Sites that say a link's title through oEmbed, a public lookup a page may
   call. Every other site keeps its link bare: its own page cannot be read from
   here. X gives no lookup a page may call, so noembed.com relays it, and it is
   the second try for the rest. */
const NOEMBED = u => "https://noembed.com/embed?url=" + encodeURIComponent(u);
const LINK_TITLE_SITES = [
  [/^https?:\/\/(www\.|m\.|music\.)?(youtube\.com\/(watch|shorts|live|playlist)|youtu\.be\/)/i,
    u => "https://www.youtube.com/oembed?format=json&url=" + encodeURIComponent(u)],
  [/^https?:\/\/(www\.|player\.)?vimeo\.com\/\S/i, u => "https://vimeo.com/api/oembed.json?url=" + encodeURIComponent(u)],
  [/^https?:\/\/open\.spotify\.com\/\S/i, u => "https://open.spotify.com/oembed?url=" + encodeURIComponent(u)],
  [/^https?:\/\/(www\.|m\.)?soundcloud\.com\/\S/i, u => "https://soundcloud.com/oembed?format=json&url=" + encodeURIComponent(u)],
  [/^https?:\/\/(www\.|mobile\.)?(twitter|x)\.com\/[^/\s]+\/status\/\d/i,
    u => NOEMBED(u.replace(/^https?:\/\/(www\.|mobile\.)?x\.com\//i, "https://twitter.com/"))],
];
