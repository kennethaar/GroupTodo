/* Plays one What's new animation into box, once (#471). steps is its text
   script, or the steps newsSteps reads from it, which says what each does.
   Classes get an "n-" prefix, so no app style leaks in.
   Words may hold [[a link]] and ~a wavy line~. still draws the last frame at
   once. A new play in box, or box leaving the page, stops this one.
   "cap | ..." says what it shows, "say | ..." tells the step now playing; both
   go to whoever drew the box (onCap, onSay), above it. */
function newsPlay(box, steps, {still = false, onCap = () => {}, onSay = () => {}} = {}) {
  if (typeof steps === "string") steps = newsSteps(steps);
  const me = (box._nRun = (box._nRun || 0) + 1);
  const live = () => box._nRun === me && (box.isConnected || still);
  const wait = ms => new Promise((res, rej) => {
    const tick = () => !live() ? rej("stop") : box._nPaused && !still ? setTimeout(tick, 150) : res();
    setTimeout(tick, still ? 0 : ms);
  });
  const parts = {};
  let spot = null;     // the callout showing now, if any
  const cls = s => String(s || "").split(/\s+/).filter(Boolean).map(c => "n-" + c);
  // The words sit in one span, so a line's gap falls between words and chips only.
  const words = (node, text) => {
    node.textContent = "";
    if (!/\[\[|~/.test(text || "")) return void (node.textContent = text || "");
    const w = el("span");
    node.append(w);
    for (const bit of String(text || "").split(/(\[\[[^\]]+\]\]|~[^~]+~)/))
      w.append(/^\[\[/.test(bit) ? el("span", {class: "n-link"}, bit.slice(2, -2))
        : /^~/.test(bit) ? el("span", {class: "n-wavy"}, bit.slice(1, -1)) : bit);
  };
  box.textContent = "";
  const key = el("kbd", {class: "n-key n-fade"}), hand = el("span", {class: "n-hand n-fade"});
  box.append(key, hand);
  const ops = {
    "+": (id, c, text, parent) => {
      const p = el("div", {class: cls(c).join(" ")});
      words(p, text);
      (parts[parent] || box).insertBefore(p, parent ? null : key);
      parts[id] = p;
      // Under a spotlight, a new part starts faded too, unless it is in what is spotlit.
      if (spot && !spot._for.some(k => k.contains(p)) && !p.parentElement.closest(".n-faded")) { p.classList.add("n-faded"); spot._faded.push(p); }
    },
    c: (id, change) => {
      for (const c of String(change).split(/\s+/).filter(Boolean))
        parts[id].classList.toggle("n-" + c.slice(1), c[0] === "+");
    },
    t: (id, text) => words(parts[id], text),
    s: (id, css) => { parts[id].style.cssText += ";" + css; },
    "-": id => {
      const p = parts[id];
      if (p === spot) spot = null;
      for (const k of p._for || []) k.classList.remove("n-ring");
      for (const f of p._faded || []) f.classList.remove("n-faded");
      p.remove();
      delete parts[id];
    },
    // A callout (#516 follow-up): beside the words of the part, not its whole row, its arrow on them.
    /* The same id again moves the spotlight straight on, in one frame, so
       nothing lights up in between. With no words it only spotlights: the
       part is read first, then its words come on the same spot. Several
       parts, a+b, share the spotlight, such as a button and the line it acts
       on; the bubble points at the first. */
    o: (id, target, where, text) => {
      const was = parts[id];
      if (was) ops["-"](id);
      const all = String(target).split("+").map(k => parts[k]).filter(Boolean), t = all[0];
      const p = el("div", {class: "n-callout n-" + where + (!text ? " n-gone" : still ? "" : " n-fade")});
      words(p, text);
      box.insertBefore(p, key);
      parts[id] = p;
      p._for = all;
      spot = p;
      for (const k of all) k.classList.add("n-ring");
      /* What it is not about fades back while it shows, at every level up to
         the stage. A chip in a line keeps its line: those words say what it is on. */
      p._faded = [];
      const keep = all.map(k => k.parentElement && k.parentElement.classList.contains("n-ln") ? k.parentElement : k);
      for (const from of keep)
        for (let n = from; n && n !== box && n.parentElement; n = n.parentElement)
          for (const s of n.parentElement.children)
            if (!keep.some(k => s.contains(k)) && !p._faded.includes(s) && !/\bn-(key|hand|callout)\b/.test(s.className)) {
              s.classList.add("n-faded");
              p._faded.push(s);
            }
      const b = box.getBoundingClientRect(), range = document.createRange();
      range.selectNodeContents(t);
      const r = range.getBoundingClientRect().width ? range.getBoundingClientRect() : t.getBoundingClientRect();
      const x = r.left - b.left - box.clientLeft, y = r.top - b.top - box.clientTop, w = p.offsetWidth, h = p.offsetHeight;
      const at = {below: [x + Math.min(r.width / 2, 30) - 16, y + r.height + 9], above: [x + Math.min(r.width / 2, 30) - 16, y - h - 9],
        right: [x + r.width + 12, y + r.height / 2 - h / 2], left: [x - w - 12, y + r.height / 2 - h / 2]}[where] || [x, y + r.height + 9];
      const left = Math.max(4, Math.min(at[0], box.clientWidth - w - 4));
      p.style.left = left + "px";
      p.style.top = Math.max(2, at[1]) + "px";
      // The arrow stays on the words when the bubble is pushed in from an edge.
      p.style.setProperty("--ax", Math.max(8, Math.min(x + Math.min(r.width / 2, 30) - left, w - 16)) + "px");
      if (!still) requestAnimationFrame(() => p.classList.remove("n-fade"));
    },
    k: async text => { key.classList.toggle("n-fade", !text); if (text) key.textContent = text; },
    ty: async (id, text) => {
      const p = parts[id], start = p.textContent;
      if (still) return void (p.textContent = start + text);
      p.classList.add("n-caret");
      for (let i = 1; i <= text.length; i++) { p.textContent = start + text.slice(0, i); await wait(42); }
      p.classList.remove("n-caret");
    },
    p: async id => {
      if (still) return;
      const b = box.getBoundingClientRect(), r = parts[id].getBoundingClientRect();
      const x = (r.left - b.left + Math.min(r.width / 2, 40)) + "px", y = (r.top - b.top + r.height / 2) + "px";
      /* It comes back where it last was, then moves; after its click it fades
         out, so it is never left standing on what you read (#516 follow-up).
         The first time, it comes in beside where it goes. */
      hand.classList.remove("n-click");
      if (!hand.style.left) { hand.style.left = "calc(" + x + " + 30px)"; hand.style.top = "calc(" + y + " + 24px)"; }
      hand.classList.remove("n-fade");
      await wait(350);
      hand.style.left = x;
      hand.style.top = y;
      await wait(650);
      hand.classList.add("n-click");
      await wait(350);
      hand.classList.add("n-fade");
    },
    w: ms => wait(ms),
    cap: (_, text) => onCap(text || ""),
    say: (_, text) => onSay(text || ""),
  };
  return (async () => {
    for (const [op, ...args] of steps) {
      if (box._nRun !== me) throw "stop";
      await ops[op](...args);
    }
    hand.classList.add("n-fade");
  })();
}
