/* On the project page itself: the same offer, standing, for anybody who said
   "not yet" or turned the asking off. */
function tourCard(path) {
  const steps = tourSteps(path);
  if (!steps.length) return null;
  const pending = steps.filter(s => s.open && s.seen);
  const left = steps.filter(s => s.open);
  const box = el("div", {class: "coach tip"});
  box.append(el("div", {class: "coach-head"},
    el("b", {}, pending.length ? "You have been to " + pending.length +
                 " of these" : "Every step is a door"),
    el("span", {style: "color:var(--fg3);font-size:12px"},
      (steps.length - left.length) + " of " + steps.length)));
  box.append(el("div", {style: "font-size:13.5px;color:var(--fg2);line-height:1.55"},
    pending.length
      ? "Tick off what you are actually done with. The app can see that you opened them; " +
        "it cannot see whether that was enough, so it asks."
      : "Press the link in a step to go straight to the part of the app it is about. " +
        "Come back and tick it off when you are done with it."));
  const acts = el("div", {style: "display:flex;gap:8px;margin-top:10px;flex-wrap:wrap"});
  if (pending.length)
    acts.append(el("button", {class: "btn sm primary", onclick: () => askTourCheckoff(pending)},
      "Check off " + pending.length));
  if (PREF.get("tour.ask", "1"))
    acts.append(el("button", {class: "btn sm ghost", onclick: () => {
      PREF.set("tour.ask", ""); notify("GroupToDo will stop asking. The button here stays.");
      render();
    }}, "stop asking me"));
  else
    acts.append(el("button", {class: "btn sm ghost", onclick: () => {
      PREF.set("tour.ask", "1"); PREF.set("tour.asked", ""); render();
    }}, "ask me again"));
  box.append(acts);
  return box;
}
