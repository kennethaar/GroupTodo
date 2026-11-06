/* Whose birthday falls in the coming week, from birthday:: on their pages.
   Gone by itself once the day has passed, so there is nothing to dismiss. */
function birthdayBox() {
  const soon = upcomingBirthdays(7);
  if (!soon.length) return null;
  return el("div", {class: "news"},
    el("span", {"aria-hidden": "true"}, svgIcon(ICON_CAKE)),
    el("div", {}, el("b", {}, soon.some(x => !x.days) ? "Birthday today" : "Birthdays this week"),
      el("ul", {}, ...soon.map(x => el("li", {},
        el("button", {onclick: () => openPageIn(x.space, x.path)}, x.name), " " + birthdayWhen(x))))));
}
