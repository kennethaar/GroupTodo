/* One slide as it is drawn: its picture place, breadcrumb, title and body.
   The deck shows it full screen; the preview on ▶ Present shows it small (#465). */
function slideSection(s) {
  // The slide's picture and its parts' pictures (#464), one place, one shown at a time.
  const pics = [...new Set([s.cover, ...(s.pics || [])].filter(Boolean))];
  const slide = el("section", {class: "slide cur lay-" + s.layout + (pics.length ? " hascover" : "") + (s.block ? "" : " titleslide")});
  if (pics.length) slide.append(el("div", {class: "cover"}, ...pics.map(src => el("div", {class: "pic", "data-pic": src},
    /^(https?|data|blob):/.test(src) ? el("img", {src, alt: ""}) : el("img", {"data-asset": src, alt: ""})))));
  slide.append(el("div", {class: "stext"}, s.breadcrumb ? el("div", {class: "scrumb"}, s.breadcrumb) : null,
    el("h1", {class: "stitle"}, s.title), slideBody(s)));
  // Places set with Alt+drag (#487).
  slideArrApply(slide, s);
  return slide;
}
