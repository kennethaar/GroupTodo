/* One stage on top of What's new that plays each new thing (#471): one
   round, then it stops on its last frame and offers Play again, or Next with
   the next one's name (#516 follow-up), so nobody has to read at its pace.
   ‹ › and the dots pick one, ⏸ stops it. The item shown is marked in the list below
   ([data-news] in list). Nothing when no new thing has an animation. With
   reduced motion each is drawn still.
   Above it, what it shows (its cap, or its news), and under that the step
   playing now, told as it goes; the first one, before anything moves, is
   its intro. */
function newsStage(entries, listBox) {
  const list = [];
  for (const e of entries) for (const it of e.items) {
    const k = newsAnimKey(e, it);
    if (NEWS_ANIM[k]) list.push({k, it, e});
  }
  if (!list.length) return null;
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const play = el("div", {class: "newsplay", "aria-hidden": "true"});
  const head = el("p", {class: "newshead"});
  const step = el("p", {class: "newsstep", "aria-live": "polite"});
  const dots = el("span", {class: "newsdots"}, ...list.map((x, i) =>
    el("button", {type: "button", "aria-label": x.it.lead, title: x.it.lead, onclick: () => show(i)})));
  const pause = el("button", {type: "button", class: "newspause", "aria-label": "Pause", title: "Pause",
    onclick: () => {
      play._nPaused = !play._nPaused;
      pause.textContent = play._nPaused ? "▶" : "⏸";
      pause.setAttribute("aria-label", play._nPaused ? "Play" : "Pause");
      pause.title = pause.getAttribute("aria-label");
    }}, "⏸");
  // After a round: the choice, under the picture, where the eye already is.
  const again = el("button", {type: "button", class: "btn ghost", onclick: () => show(at)}, "↻ Play again");
  const next = el("button", {type: "button", class: "btn primary newsgo", onclick: () => show(at + 1)});
  const end = el("div", {class: "newsend", hidden: true}, again, list.length > 1 ? next : null);
  const stage = el("div", {class: "newsstage", role: "group", "aria-label": "What's new, shown"},
    head, step, play, end,
    el("div", {class: "newsnav"},
      el("button", {type: "button", class: "newsprev", "aria-label": "Previous", onclick: () => show(at - 1)}, "‹"),
      dots,
      el("button", {type: "button", class: "newsnext", "aria-label": "Next", onclick: () => show(at + 1)}, "›"),
      still ? null : pause));
  let at = 0, run = 0;
  const show = i => {
    at = (i + list.length) % list.length;
    const x = list[at];
    const named = text => {
      head.textContent = "";
      head.append(el("strong", {}, text), el("span", {class: "quiet"}, " · v" + x.e.version));
    };
    // What it shows and its intro, at once: read from the script before it plays.
    const steps = newsSteps(NEWS_ANIM[x.k]), first = o => (steps.find(s => s[0] === o) || [])[2];
    named(first("cap") || x.it.lead);
    step.textContent = first("say") || "";
    [...dots.children].forEach((d, j) => j === at ? d.setAttribute("aria-current", "true") : d.removeAttribute("aria-current"));
    listBox.querySelectorAll("[data-news]").forEach(li => li.classList.toggle("newsnow", li.dataset.news === x.k));
    const me = ++run;
    end.hidden = true;
    next.textContent = "Next: " + list[(at + 1) % list.length].it.lead.replace(/\.$/, "") + " ›";
    newsPlay(play, steps, {still, onCap: t => { if (run === me) named(t); },
      onSay: t => { if (run === me) step.textContent = t; }})
      .then(() => { if (run === me && play.isConnected) end.hidden = false; })
      .catch(e => { if (e !== "stop") console.error(e); });
  };
  show(0);
  return stage;
}
