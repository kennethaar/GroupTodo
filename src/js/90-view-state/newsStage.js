/* One stage on top of What's new that plays each new thing in turn (#471):
   a round, a pause on its last frame, then the next. ‹ › and the dots pick
   one, ⏸ stops it. The item shown is marked in the list below
   ([data-news] in list). Nothing when no new thing has an animation. With
   reduced motion each is drawn still and nothing turns on by itself.
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
  const stage = el("div", {class: "newsstage", role: "group", "aria-label": "What's new, shown"},
    head, step, play,
    el("div", {class: "newsnav"},
      el("button", {type: "button", class: "newsprev", "aria-label": "Previous", onclick: () => show(at - 1)}, "‹"),
      dots,
      el("button", {type: "button", class: "newsnext", "aria-label": "Next", onclick: () => show(at + 1)}, "›"),
      still ? null : pause));
  let at = 0;
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
    const me = at;
    newsPlay(play, steps, {still, onCap: t => { if (at === me) named(t); },
      onSay: t => { if (at === me) step.textContent = t; }})
      .then(() => new Promise((res, rej) => {
        let left = NEWS_HOLD;
        const tick = () => !play.isConnected ? rej("stop") : at !== me ? rej("stop")
          : (left -= play._nPaused ? 0 : 150) <= 0 ? res() : setTimeout(tick, 150);
        setTimeout(tick, 150);
      }))
      .then(() => { if (!still && at === me) show(at + 1); })
      .catch(e => { if (e !== "stop") console.error(e); });
  };
  show(0);
  return stage;
}
