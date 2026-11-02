/* ---------- the projects list on a phone ----------
   One row for search, filter and sort, the statuses in one row that scrolls
   sideways, and the area, organisation and order each in a sheet from the
   bottom, so the first project shows without scrolling. On a wide screen the
   same bar is the row of chips and dropdowns it always was. */
const svgIcon = d => { const s = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  s.setAttribute("viewBox", "0 0 24 24"); s.setAttribute("aria-hidden", "true");
  s.innerHTML = d; return s; };
const ICON_SEARCH = '<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/>';
const ICON_FUNNEL = '<path d="M4 5h16l-6.2 7.6V19l-3.6-1.8v-4.6z"/>';
const ICON_SORT = '<path d="M8 4v16M4.5 7.5L8 4l3.5 3.5M16 20V4M12.5 16.5L16 20l3.5-3.5"/>';
const searchBox = input => el("span", {class: "searchbox"}, svgIcon(ICON_SEARCH), input);
