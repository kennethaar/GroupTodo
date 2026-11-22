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
    },
    c: (id, change) => {
      for (const c of String(change).split(/\s+/).filter(Boolean))
        parts[id].classList.toggle("n-" + c.slice(1), c[0] === "+");
    },
    t: (id, text) => words(parts[id], text),
    s: (id, css) => { parts[id].style.cssText += ";" + css; },
    "-": id => { parts[id].remove(); delete parts[id]; },
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
      hand.style.left = (r.left - b.left + Math.min(r.width / 2, 40)) + "px";
      hand.style.top = (r.top - b.top + r.height / 2) + "px";
      hand.classList.remove("n-fade", "n-click");
      await wait(650);
      hand.classList.add("n-click");
      await wait(250);
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
