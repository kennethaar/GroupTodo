function viewSomeday(c, passList) {
  c.classList.add("solwrap");
  const head = c.firstChild;
  const K = sdK(), by = sdSpaces(), space = sdSpaceNow(by);
  const S = space == null ? null : sdStanding(space);
  c.append(el("aside", {class: "solside"}, head, passList,
    el("p", {class: "solhow"}, SOL_PASSES[K.pass()].say),
    by.size > 1 ? el("div", {class: "solfilt"}, ...[...by].map(([sp, n]) => fchip(sp, sp === space, () => {
      if (sp === space) return;
      PREF.set(K.pref, sp); SD.skipped.clear(); SD.keep = null; render();
    }, n))) : null,
    S ? el("div", {class: "solcount"}, S.items.length + " " + K.count + " · " + S.played + " choices remembered") : null,
    SD.last ? el("button", {class: "textbtn", onclick: sdUndo}, "Undo the last choice") : null,
    el("p", {class: "solhow"}, K.how),
    el("p", {class: "solhow"}, "Keys: ← takes the left one, → the right one, ↓ skips the pair, Backspace undoes the last choice.")));
  if (!S || !S.items.length) {
    c.append(emptyCard(el("div", {style: "font-size:34px"}, "🂡"), el("b", {}, K.none[0]), el("br"), K.none[1],
      ...sdOnward()));
    return c;
  }
  const duel = el("div", {class: "sdduel"});
  if (S.pair) {
    let [a, b] = S.pair;
    const k = SD.keep;
    if (k && ((sdSlug(a) === k.slug && k.side === 1) || (sdSlug(b) === k.slug && k.side === 0))) [a, b] = [b, a];
    const more = S.open.length - 1;
    duel.append(
      el("div", {class: "sdhead"},
        el("span", {}, "Place " + (S.ranked.length + 1) + " of " + S.target + " · " + (more === 1 ? "this choice settles it" : "about " + more + " choices to settle it")),
        el("span", {}, SD.n ? SD.n + " chosen now" : "")),
      el("div", {class: "sdprog"}, el("i", {style: "width:" + (S.ranked.length / S.target * 100) + "%"})),
      el("h2", {class: "sdask"}, K.ask),
      el("div", {class: "sdpair"}, sdCard(space, a, b, 0), el("div", {class: "sdvs"}, "vs"), sdCard(space, b, a, 1)),
      el("button", {class: "textbtn sdskip", onclick: () => sdSkip(a, b)}, "Can't decide? Skip this pair ›"));
  } else if (S.open.length > 1) {
    duel.append(emptyCard(el("b", {}, "Every pair left was skipped."), el("br"),
      (!S.ranked.length ? "Nothing is settled yet" : S.ranked.length === 1 ? "The top one is settled" : "The top " + S.ranked.length + " are settled") +
        "; the rest are too close to call today.", el("br"), el("br"),
      el("button", {class: "btn", onclick: () => { SD.skipped.clear(); render(); }}, "Ask the skipped pairs again")));
  } else {
    duel.append(emptyCard(el("div", {style: "font-size:34px"}, "🏆"),
      el("b", {}, S.target === 1 ? K.one : "The top " + S.target + " are settled."), el("br"), K.done,
      ...sdOnward()));
  }
  const rank = el("div", {class: "card sdrank"},
    el("div", {class: "sdrank-h"}, el("b", {}, "Current ranking"), el("span", {class: "chip"}, S.ranked.length + " of " + S.target)),
    el("p", {class: "solhow"}, K.rankSay),
    el("ol", {}, ...S.ranked.map((r, i) => sdRow(r, i + 1)),
      ...Array.from({length: S.target - S.ranked.length}, (_, i) => el("li", {class: "open"},
        el("span", {class: "n"}, String(S.ranked.length + i + 1)), el("span", {class: "nm"}, "still in play")))),
    S.rest.length ? el("details", {}, el("summary", {}, "The other " + S.rest.length + ", most wins first"),
      el("ol", {}, ...S.rest.map(r => sdRow(r)))) : null);
  c.append(el("div", {class: "sdtable"}, duel, rank));
  return c;
}
