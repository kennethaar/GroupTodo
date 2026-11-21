/* Plays one rule of the outlining lesson into box, over and over, until the
   box leaves the page or another rule starts in it (#468). With reduced
   motion the rule is drawn at its end, still. */
function outlineLessonPlay(box, rule) {
  const me = (box._olRun = (box._olRun || 0) + 1);
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const live = () => box._olRun === me && box.isConnected;
  const wait = ms => new Promise((res, rej) => setTimeout(() => live() ? res() : rej("stop"), still ? 0 : ms));
  const L = OUTLINE_LESSON;
  let rows = [];
  const add = line => {
    const mark = el("span", {class: line.task ? "olbox" : "olbul"});
    const txt = el("span", {class: "oltxt"}), chips = el("span", {class: "olchips"});
    const badge = el("span", {class: "olbadge"}), key = el("kbd", {class: "olkey olhide"});
    const r = el("div", {class: "olrow", style: "--d:" + line.d}, mark, txt, chips, badge, key);
    box.append(r);
    const row = {r, mark, txt, chips, badge, key, line};
    rows.push(row);
    return row;
  };
  const ownChips = row => { for (const c of row.line.own || []) row.chips.append(el("span", {class: "olchip own"}, c)); };
  const typed = async line => {
    const row = add(line);
    if (line.key) { row.key.textContent = line.key; row.key.classList.remove("olhide"); }
    row.txt.classList.add("olcaret");
    for (let i = 1; i <= line.text.length; i++) { row.txt.textContent = line.text.slice(0, i); await wait(38); }
    row.txt.classList.remove("olcaret");
    await wait(250);
    row.key.classList.add("olhide");
    ownChips(row);
    await wait(200);
  };
  const whole = () => { for (const line of L.lines) { const row = add(line); row.txt.textContent = line.text; ownChips(row); } };
  const inherit = async () => {
    for (const row of rows.filter(r => r.line.d > 0)) {
      for (const c of L.inherited) {
        const chip = el("span", {class: "olchip inh olhide"}, "↳ " + c);
        row.chips.append(chip);
        await wait(60); chip.classList.remove("olhide");
      }
      await wait(380);
    }
  };
  const gather = async () => {
    rows[1].badge.textContent = "· 1 to-do";
    await wait(500);
    for (let n = 1; n <= 3; n++) { rows[0].badge.textContent = "· " + n + (n === 1 ? " to-do" : " to-dos"); await wait(420); }
  };
  const lit = i => rows.forEach((row, j) => {
    row.r.classList.toggle("olnext", j === i);
    row.r.classList.toggle("oldim", j !== i && j !== 0 && !row.r.classList.contains("oldone"));
    row.chips.querySelectorAll(".tag").forEach(x => x.remove());
    if (j === i) row.chips.prepend(el("span", {class: "olchip tag"}, "Next"));
  });
  const tick = i => {
    const row = rows[i];
    row.r.classList.add("oldone"); row.r.classList.remove("olnext", "oldim");
    row.mark.textContent = "✓";
    row.chips.querySelectorAll(".tag").forEach(x => x.remove());
  };
  (async () => {
    for (;;) {
      box.textContent = ""; rows = [];
      if (rule === 0) for (const line of L.lines) await typed(line);
      else {
        whole(); await wait(600);
        if (rule >= 1) await inherit();
        if (rule === 2) { await wait(300); await gather(); }
        if (rule === 3) {
          lit(2); await wait(1800); tick(2); await wait(400);
          lit(1); await wait(1500); tick(1); await wait(400);
          lit(3);
        }
      }
      if (still) return;
      await wait(3000);
    }
  })().catch(e => { if (e !== "stop") console.error(e); });
}
