/* ---------- the panel's sections behind icons ----------
   The full panel is a long scroll on a laptop and a very long one on a phone.
   The everyday part -- title, state, where it sits -- stays open; dates,
   repeats, chat, who, hygiene and history each sit behind an icon in the
   header, one open at a time. */
const DETAIL_ICONS = {
  date: SVG("detail-date"),
  repeat: SVG("detail-repeat"),
  chat: SVG("detail-chat"),
  who: SVG("detail-who"),
  gtd: SVG("detail-gtd"),
  history: SVG("detail-history"),
  more: SVG("detail-more"),
};
const detailIcon = kind => DETAIL_ICONS[kind];

/* [icon, tooltip, the field labels that pane holds] */
const DETAIL_GROUPS = [
  ["date", "Dates", ["Scheduled", "Deadline", "Calendar", "Reminder"]],
  ["repeat", "Repeats", ["Repeats"]],
  ["chat", "Chat", ["Chat"]],
  ["who", "Who is doing it", ["Who is doing it"]],
  ["gtd", "GTD hygiene", ["GTD hygiene", "Priority", "Urgency"]],
  ["history", "History", ["Trail", "Source"]],
];
